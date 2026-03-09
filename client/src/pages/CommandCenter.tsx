import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Agent {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'standby';
  lastAction: string;
  task: string;
  color: string;
}

interface MemoryRecord {
  id: number;
  title: string;
  category: string;
  importance: string;
  created_at: string;
}

// ─────────────────────────────────────────────
// WebGL Particle Background
// ─────────────────────────────────────────────
const VERTEX_SHADER = `
  attribute vec3 position;
  attribute float alpha;
  attribute float size;
  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    vAlpha = alpha;
    vec3 pos = position;
    pos.x += sin(uTime * 0.3 + position.y * 2.0) * 0.15;
    pos.y += cos(uTime * 0.2 + position.x * 1.5) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / length((modelViewMatrix * vec4(pos, 1.0)).xyz));
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying float vAlpha;
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, vAlpha * glow * 0.6);
  }
`;

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    // Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Compile shader
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Particles
    const COUNT = 800;
    const positions = new Float32Array(COUNT * 3);
    const alphas = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      alphas[i] = Math.random() * 0.5 + 0.1;
      sizes[i] = Math.random() * 3 + 1;
    }

    // Buffers
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    const alphaBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf);
    gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.STATIC_DRAW);
    const alphaLoc = gl.getAttribLocation(prog, 'alpha');
    gl.enableVertexAttribArray(alphaLoc);
    gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 0, 0);

    const sizeBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    const sizeLoc = gl.getAttribLocation(prog, 'size');
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTimeLoc = gl.getUniformLocation(prog, 'uTime');
    const uColorLoc = gl.getUniformLocation(prog, 'uColor');
    const projLoc = gl.getUniformLocation(prog, 'projectionMatrix');
    const mvLoc = gl.getUniformLocation(prog, 'modelViewMatrix');

    // Simple perspective matrix
    const aspect = canvas.width / canvas.height;
    const fov = Math.PI / 4;
    const near = 0.1, far = 100;
    const f = 1.0 / Math.tan(fov / 2);
    const projMatrix = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0
    ]);
    gl.uniformMatrix4fv(projLoc, false, projMatrix);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let startTime = Date.now();

    const animate = () => {
      const t = (Date.now() - startTime) * 0.001;

      // Update positions based on mouse
      const mx = mouseRef.current.x * 2;
      const my = mouseRef.current.y * 2;

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      for (let i = 0; i < COUNT; i++) {
        const idx = i * 3;
        const dx = positions[idx] - mx * 3;
        const dy = positions[idx + 1] - my * 3;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 3) {
          const force = (3 - dist) * 0.002;
          positions[idx] -= dx * force;
          positions[idx + 1] -= dy * force;
        }
      }
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

      // Model-view matrix (camera at z=8)
      const mvMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        mx * 0.3, my * 0.3, -12, 1
      ]);
      gl.uniformMatrix4fv(mvLoc, false, mvMatrix);

      gl.uniform1f(uTimeLoc, t);
      gl.uniform3f(uColorLoc, 0.85, 0.75, 0.4); // warm gold

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, COUNT);

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

// ─────────────────────────────────────────────
// 3D Tilt Card
// ─────────────────────────────────────────────
function TiltCard({ children, className = '', glowColor = '#FFD700' }: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -12;
    const rotateY = (x - 0.5) * 12;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlowPos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
        position: 'relative',
        willChange: 'transform',
      }}
    >
      {/* Animated gradient border */}
      <div style={{
        position: 'absolute',
        inset: -1,
        borderRadius: 'inherit',
        background: `conic-gradient(from var(--border-angle, 0deg), transparent 40%, ${glowColor}33 50%, transparent 60%)`,
        animation: 'borderRotate 4s linear infinite',
        zIndex: -1,
        opacity: 0.6,
      }} />
      {/* Glow follow cursor */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}08 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Animated Counter
// ─────────────────────────────────────────────
function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = value;
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
}

// ─────────────────────────────────────────────
// Pulse Dot
// ─────────────────────────────────────────────
function PulseDot({ color, active }: { color: string; active: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
      {active && (
        <span style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: color,
          opacity: 0.4,
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      )}
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: active ? `0 0 8px ${color}, 0 0 16px ${color}44` : 'none',
      }} />
    </span>
  );
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const AGENTS: Agent[] = [
  {
    id: 'uz2r9myC2k4OteWWWkoc6A',
    name: '記録係',
    status: 'active',
    lastAction: 'Gemini分析・OSHI WORLD更新',
    task: '毎日の記録・分析・ダッシュボード更新',
    color: '#00FF88',
  },
  {
    id: 'XzwBDxJ7D6eB7Tl3zJht5T',
    name: 'OSHI Jr',
    status: 'active',
    lastAction: 'Telegramボット稼働中',
    task: 'Telegramボット・MacMini管理',
    color: '#FFD700',
  },
  {
    id: 'FXSgyscqgXhMO4ONZkpvGB',
    name: 'グローブ改善',
    status: 'active',
    lastAction: 'AQダッシュボード最適化',
    task: 'AirdropsQuestダッシュボード改善',
    color: '#3B82F6',
  },
  {
    id: '59Gfa0GvhOSgHm4fL0lI3S',
    name: '収益化分析',
    status: 'completed',
    lastAction: '稼ぎ頭リスト作成完了',
    task: '収益化戦略・稼ぎ頭リスト作成',
    color: '#A855F7',
  },
  {
    id: 'hTZb2nlSCAmlMVD4zBEdub',
    name: 'KAGURAウォレット監視',
    status: 'standby',
    lastAction: 'SOL残高チェック待機中',
    task: 'SOL残高監視・アラート',
    color: '#F59E0B',
  },
];

const STATUS_MAP: Record<string, { label: string; color: string; dotColor: string }> = {
  active: { label: '稼働中', color: '#00FF8844', dotColor: '#00FF88' },
  completed: { label: '完了', color: '#A855F744', dotColor: '#A855F7' },
  standby: { label: '待機中', color: '#ffffff22', dotColor: '#666666' },
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function CommandCenter() {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [memoryCount, setMemoryCount] = useState(147);
  const [todayCount, setTodayCount] = useState(5);
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const t: Record<string, string> = useMemo(() => ({
    live: language === 'ja' ? 'LIVE' : 'LIVE',
  }), [language]);

  // Fetch Supabase data
  const fetchData = useCallback(async () => {
    try {
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
      const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_KEY || '';
      if (!supabaseUrl || !supabaseKey) {
        // Use fallback data
        setMemories([
          { id: 1, title: 'Mac Mini 2台体制確認', category: 'infrastructure', importance: 'critical', created_at: '2026-03-09T14:00:00Z' },
          { id: 2, title: 'OSHI Jr Telegram Bot完成', category: 'system_status', importance: 'critical', created_at: '2026-03-09T13:00:00Z' },
          { id: 3, title: 'Telegram Bot接続済み - OSHI Jr用', category: 'critical_infrastructure', importance: 'critical', created_at: '2026-03-09T12:00:00Z' },
          { id: 4, title: 'インフラ接続情報の即時記録ルール', category: 'improvement', importance: 'critical', created_at: '2026-03-09T11:00:00Z' },
          { id: 5, title: 'OSHIがTelegram接続を忘れた', category: 'failure_log', importance: 'critical', created_at: '2026-03-09T10:00:00Z' },
        ]);
        return;
      }
      const res = await fetch(`${supabaseUrl}/rest/v1/amato_memories?select=id,title,category,importance,created_at&order=created_at.desc&limit=5`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
      // Count
      const countRes = await fetch(`${supabaseUrl}/rest/v1/amato_memories?select=id`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Prefer: 'count=exact' },
      });
      if (countRes.ok) {
        const ct = countRes.headers.get('content-range');
        if (ct) {
          const total = parseInt(ct.split('/')[1]);
          if (!isNaN(total)) setMemoryCount(total);
        }
      }
    } catch {
      // silent fail, use fallback
    }
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const activeCount = AGENTS.filter(a => a.status === 'active').length;
  const sortedAgents = useMemo(() =>
    [...AGENTS].sort((a, b) => {
      const order = { active: 0, completed: 1, standby: 2 };
      return order[a.status] - order[b.status];
    }), []);

  return (
    <div style={{ minHeight: '100vh', background: '#000000', position: 'relative' }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes borderRotate {
          from { --border-angle: 0deg; }
          to { --border-angle: 360deg; }
        }
        @property --border-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .cmd-grid-bg {
          background-image:
            linear-gradient(rgba(255,215,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,215,0,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 20s linear infinite;
        }
        .cmd-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          backdrop-filter: blur(12px);
          overflow: hidden;
        }
        .cmd-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(16px);
        }
        .cmd-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.04) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        .cmd-memory-row {
          transition: all 0.2s ease;
        }
        .cmd-memory-row:hover {
          background: rgba(255,255,255,0.03);
        }
      `}</style>

      {/* WebGL Particles */}
      <ParticleBackground />

      {/* Grid overlay */}
      <div className="cmd-grid-bg" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header language={language} setLanguage={setLanguage} t={t} />

        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 80px' }}>

          {/* ── Page Title ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 32 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <span style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: '#FFD700',
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}>COMMAND CENTER</span>
              <span style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: '#ffffff33',
                letterSpacing: 1,
              }}>v1.0</span>
            </div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#FFD700',
              textShadow: '0 0 30px rgba(255,215,0,0.15)',
              margin: 0,
              letterSpacing: 1,
            }}>
              エージェント司令室
            </h1>
            <p style={{
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#ffffff44',
              marginTop: 6,
            }}>
              最終更新: {lastUpdated.toLocaleTimeString('ja-JP')} — 30秒ごとに自動更新
            </p>
          </motion.div>

          {/* ── First View: Stats Overview ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginBottom: 32,
            }}
          >
            {/* Supabase Records */}
            <TiltCard className="cmd-stat-card" glowColor="#FFD700">
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff44', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                  SUPABASE RECORDS
                </div>
                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'monospace', color: '#FFD700', lineHeight: 1, textShadow: '0 0 20px rgba(255,215,0,0.2)' }}>
                  <AnimatedCounter value={memoryCount} />
                </div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#00FF8888', marginTop: 6 }}>
                  +{todayCount} today
                </div>
              </div>
            </TiltCard>

            {/* Active Agents */}
            <TiltCard className="cmd-stat-card" glowColor="#00FF88">
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff44', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                  ACTIVE AGENTS
                </div>
                <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'monospace', color: '#00FF88', lineHeight: 1, textShadow: '0 0 20px rgba(0,255,136,0.2)' }}>
                  <AnimatedCounter value={activeCount} />
                </div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#ffffff44', marginTop: 6 }}>
                  / {AGENTS.length} total
                </div>
              </div>
            </TiltCard>

            {/* Mac Mini 大 */}
            <TiltCard className="cmd-stat-card" glowColor="#3B82F6">
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff44', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                  MAC MINI 大
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PulseDot color="#00FF88" active={true} />
                  <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'monospace', color: '#00FF88' }}>
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#ffffff44', marginTop: 8 }}>
                  OSHI Jr 24h稼働
                </div>
              </div>
            </TiltCard>

            {/* Mac Mini 小 */}
            <TiltCard className="cmd-stat-card" glowColor="#F59E0B">
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff44', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                  MAC MINI 小
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PulseDot color="#F59E0B" active={false} />
                  <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'monospace', color: '#F59E0B' }}>
                    STANDBY
                  </span>
                </div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#ffffff44', marginTop: 8 }}>
                  準備中 — 増設予定
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* ── Second View: Agent Cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: 32 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#FFD700', letterSpacing: 2, textTransform: 'uppercase' }}>
                AGENTS
              </span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff22' }}>
                ──────────────────────────────
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340, 1fr))',
              gap: 14,
            }}>
              {sortedAgents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                >
                  <TiltCard className="cmd-card" glowColor={agent.color}>
                    <div style={{ padding: '18px 22px' }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <PulseDot color={STATUS_MAP[agent.status].dotColor} active={agent.status === 'active'} />
                          <span style={{
                            fontSize: 15,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: agent.color,
                            textShadow: agent.status === 'active' ? `0 0 12px ${agent.color}44` : 'none',
                          }}>
                            {agent.name}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 9,
                          fontFamily: 'monospace',
                          padding: '3px 8px',
                          borderRadius: 4,
                          backgroundColor: STATUS_MAP[agent.status].color,
                          color: STATUS_MAP[agent.status].dotColor,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}>
                          {STATUS_MAP[agent.status].label}
                        </span>
                      </div>

                      {/* Task */}
                      <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#ffffffaa', marginBottom: 8, lineHeight: 1.5 }}>
                        {agent.task}
                      </div>

                      {/* Last action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff33' }}>LAST:</span>
                        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff66' }}>{agent.lastAction}</span>
                      </div>

                      {/* ID */}
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff22', letterSpacing: 0.5 }}>
                          ID: {agent.id}
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Third View: Latest Memories ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#FFD700', letterSpacing: 2, textTransform: 'uppercase' }}>
                LATEST MEMORIES
              </span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff22' }}>
                ──────────────────────────────
              </span>
            </div>

            <TiltCard className="cmd-card" glowColor="#FFD700">
              <div style={{ padding: 0 }}>
                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 140px 100px 160px',
                  padding: '12px 22px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  {['TITLE', 'CATEGORY', 'IMPORTANCE', 'CREATED'].map(h => (
                    <span key={h} style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff33', letterSpacing: 2, textTransform: 'uppercase' }}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                <AnimatePresence>
                  {memories.map((mem, i) => (
                    <motion.div
                      key={mem.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06 }}
                      className="cmd-memory-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 140px 100px 160px',
                        padding: '12px 22px',
                        borderBottom: i < memories.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#ffffffcc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                        {mem.title}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        padding: '2px 6px',
                        borderRadius: 3,
                        backgroundColor: mem.category === 'critical_infrastructure' ? '#FFD70015' :
                          mem.category === 'failure_log' ? '#FF444415' :
                          mem.category === 'improvement' ? '#00FF8815' :
                          '#3B82F615',
                        color: mem.category === 'critical_infrastructure' ? '#FFD700' :
                          mem.category === 'failure_log' ? '#FF6666' :
                          mem.category === 'improvement' ? '#00FF88' :
                          '#60A5FA',
                        display: 'inline-block',
                        width: 'fit-content',
                      }}>
                        {mem.category}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        color: mem.importance === 'critical' ? '#FF6666' : '#ffffff66',
                        fontWeight: mem.importance === 'critical' ? 700 : 400,
                      }}>
                        {mem.importance}
                      </span>
                      <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff44' }}>
                        {new Date(mem.created_at).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {memories.length === 0 && (
                  <div style={{ padding: '24px 22px', textAlign: 'center' }}>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#ffffff33' }}>
                      Coming Soon — Supabase接続待ち
                    </span>
                  </div>
                )}
              </div>
            </TiltCard>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: 48, textAlign: 'center' }}
          >
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff22', letterSpacing: 1 }}>
              COMMAND CENTER v1.0 — OSHI WORLD — 2026-03-09
            </p>
            <p style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff15', marginTop: 4 }}>
              OSHIの軍団を作る
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
