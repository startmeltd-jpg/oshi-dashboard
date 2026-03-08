import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const vertex = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragment = `
precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
varying vec2 vUv;

#define NUM_OCTAVES 5

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
    u.y
  );
  return res * res;
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = vUv;
  vec2 uv = p * vec2(uResolution.x / uResolution.y, 1.0);
  float t = uTime * 0.05;
  
  float noise1 = fbm(uv * 3.0 + t);
  float noise2 = fbm(uv * 2.0 - t * 0.5);
  
  vec3 col = vec3(0.0);
  col += uColor * noise1 * 0.5;
  col += vec3(0.1, 0.2, 0.4) * noise2 * 0.3;
  
  // Stars
  vec2 grid = fract(uv * 50.0 + t * 0.1) - 0.5;
  float star = smoothstep(0.05, 0.0, length(grid));
  float starBrightness = rand(floor(uv * 50.0 + t * 0.1));
  star *= step(0.7, starBrightness);
  col += vec3(1.0) * star * 2.0;
  
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Galaxy() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0.3, 0.2, 0.5) },
        uResolution: { value: [window.innerWidth, window.innerHeight, 1] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animId: number;
    function update(t: number) {
      animId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animId = requestAnimationFrame(update);

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight, 1];
    }
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div ref={containerRef} />;
}
