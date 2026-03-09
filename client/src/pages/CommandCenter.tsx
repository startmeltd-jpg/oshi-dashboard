import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Agent {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'standby' | 'error';
  lastAction: string;
  task: string;
  color: string;
  phase: string;
  progress: number; // 0-100
  updatedAt: string;
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
  uniform vec2 uMouse;
  varying float vAlpha;
  void main() {
    vAlpha = alpha;
    vec3 pos = position;
    float dx = pos.x - uMouse.x * 2.0;
    float dy = pos.y - uMouse.y * 2.0;
    float dist = sqrt(dx*dx + dy*dy);
    float influence = max(0.0, 1.0 - dist * 0.4);
    pos.x += sin(uTime * 0.3 + position.y * 2.0) * 0.15 + uMouse.x * influence * 0.08;
    pos.y += cos(uTime * 0.2 + position.x * 1.5) * 0.1 + uMouse.y * influence * 0.08;
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

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

    const N = 280;
    const positions = new Float32Array(N * 3);
    const alphas = new Float32Array(N);
    const sizes = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      alphas[i] = Math.random() * 0.5 + 0.1;
      sizes[i]  = Math.random() * 2.5 + 0.5;
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
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

    const projLoc = gl.getUniformLocation(prog, 'projectionMatrix');
    const mvLoc   = gl.getUniformLocation(prog, 'modelViewMatrix');
    const timeLoc = gl.getUniformLocation(prog, 'uTime');
    const mouseLoc = gl.getUniformLocation(prog, 'uMouse');
    const colorLoc = gl.getUniformLocation(prog, 'uColor');

    const proj = new Float32Array([
      1, 0, 0, 0,
      0, 1.5, 0, 0,
      0, 0, -1, 0,
      0, 0, 0, 1,
    ]);
    const mv = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, -5, 1,
    ]);

    gl.uniformMatrix4fv(projLoc, false, proj);
    gl.uniformMatrix4fv(mvLoc, false, mv);
    gl.uniform3f(colorLoc, 1.0, 0.85, 0.0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    let startTime = performance.now();
    const render = () => {
      const t = (performance.now() - startTime) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLoc, t);
      gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.POINTS, 0, N);
      animFrameRef.current = requestAnimationFrame(render);
    };
    render();

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
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.7,
      }}
    />
  );
}

// ─────────────────────────────────────────────
// TiltCard
// ─────────────────────────────────────────────
function TiltCard({ children, className = '', glowColor = '#FFD700' }: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`;
    el.style.boxShadow = `0 0 20px ${glowColor}18, 0 0 40px ${glowColor}08`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    el.style.boxShadow = 'none';
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// AnimatedCounter
// ─────────────────────────────────────────────
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = value;
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display}</>;
}

// ─────────────────────────────────────────────
// PulseDot
// ─────────────────────────────────────────────
function PulseDot({ color, active }: { color: string; active: boolean }) {
  return (
    <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        backgroundColor: color,
        boxShadow: active ? `0 0 8px ${color}88` : 'none',
      }} />
      {active && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          backgroundColor: color, opacity: 0.4,
          animation: 'pulse 2s ease-out infinite',
        }} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ProgressBar
// ─────────────────────────────────────────────
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{
      width: '100%',
      height: 3,
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: 2,
      overflow: 'hidden',
      marginTop: 10,
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 2,
          boxShadow: `0 0 6px ${color}44`,
        }}
      />
    </div>
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
    phase: 'Phase 6 / 記録・デプロイ',
    progress: 85,
    updatedAt: '2026-03-09 14:30',
  },
  {
    id: 'XzwBDxJ7D6eB7Tl3zJht5T',
    name: 'OSHI Jr',
    status: 'active',
    lastAction: 'Telegramボット稼働中 / MacMini管理',
    task: 'Telegramボット・MacMini 24h運用',
    color: '#FFD700',
    phase: 'Phase 5 / デプロイ・稼働',
    progress: 100,
    updatedAt: '2026-03-09 15:00',
  },
  {
    id: 'FXSgyscqgXhMO4ONZkpvGB',
    name: 'グローブ改善',
    status: 'active',
    lastAction: 'AQダッシュボード最適化中',
    task: 'AirdropsQuestダッシュボード改善',
    color: '#3B82F6',
    phase: 'Phase 3 / UI改善',
    progress: 60,
    updatedAt: '2026-03-09 13:45',
  },
  {
    id: '59Gfa0GvhOSgHm4fL0lI3S',
    name: '収益化分析',
    status: 'completed',
    lastAction: '稼ぎ頭リスト作成完了',
    task: '収益化戦略・稼ぎ頭リスト作成',
    color: '#A855F7',
    phase: '完了',
    progress: 100,
    updatedAt: '2026-03-08 20:00',
  },
  {
    id: 'hTZb2nlSCAmlMVD4zBEdub',
    name: 'KAGURAウォレット監視',
    status: 'standby',
    lastAction: 'SOL残高チェック待機中',
    task: 'SOL残高監視・変化時Telegram通知',
    color: '#F59E0B',
    phase: '待機中 / MacMini起動待ち',
    progress: 0,
    updatedAt: '2026-03-09 09:00',
  },
];

const STATUS_MAP: Record<string, { label: string; color: string; dotColor: string; bg: string }> = {
  active:    { label: '稼働中',   color: '#00FF8844', dotColor: '#00FF88', bg: '#00FF8812' },
  completed: { label: '完了',     color: '#A855F744', dotColor: '#A855F7', bg: '#A855F712' },
  standby:   { label: '待機中',   color: '#ffffff22', dotColor: '#888888', bg: '#ffffff08' },
  error:     { label: '問題あり', color: '#FF444444', dotColor: '#FF6666', bg: '#FF444412' },
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
  const [tick, setTick] = useState(0);

  const t: Record<string, string> = useMemo(() => ({ live: 'LIVE' }), []);

  const fetchData = useCallback(async () => {
    try {
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
      const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_KEY || '';
      if (!supabaseUrl || !supabaseKey) {
        setMemories([
          { id: 1, title: 'OSHI Central Hub v2.0 構築完了', category: 'critical_infrastructure', importance: 'critical', created_at: '2026-03-09T15:00:00Z' },
          { id: 2, title: 'Mac Mini 2台体制確認', category: 'infrastructure', importance: 'critical', created_at: '2026-03-09T14:00:00Z' },
          { id: 3, title: 'OSHI Jr Telegram Bot完成', category: 'system_status', importance: 'critical', created_at: '2026-03-09T13:00:00Z' },
          { id: 4, title: 'Telegram Bot接続済み - OSHI Jr用', category: 'critical_infrastructure', importance: 'critical', created_at: '2026-03-09T12:00:00Z' },
          { id: 5, title: 'インフラ接続情報の即時記録ルール', category: 'improvement', importance: 'critical', created_at: '2026-03-09T11:00:00Z' },
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
    } catch { /* silent fail */ }
    setLastUpdated(new Date());
    setTick(t => t + 1);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const activeCount = AGENTS.filter(a => a.status === 'active').length;
  const sortedAgents = useMemo(() =>
    [...AGENTS].sort((a, b) => {
      const order: Record<string, number> = { active: 0, error: 1, completed: 2, standby: 3 };
      return order[a.status] - order[b.status];
    }), []);

  return (
    <div style={{ minHeight: '100vh', background: '#000000', position: 'relative' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes borderGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .cmd-grid-bg {
          background-image:
            linear-gradient(rgba(255,215,0,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,215,0,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 25s linear infinite;
        }
        .cmd-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          backdrop-filter: blur(16px);
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .cmd-card:hover {
          border-color: rgba(255,255,255,0.14);
        }
        .cmd-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          backdrop-filter: blur(20px);
        }
        .cmd-memory-row {
          transition: background 0.2s ease;
        }
        .cmd-memory-row:hover {
          background: rgba(255,255,255,0.025);
        }
        .cmd-active-border {
          animation: borderGlow 3s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .cmd-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cmd-agents-grid { grid-template-columns: 1fr !important; }
          .cmd-memory-table { grid-template-columns: 1fr 80px !important; }
          .cmd-memory-col-hide { display: none !important; }
        }
        @media (max-width: 480px) {
          .cmd-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .cmd-page-title { font-size: 22px !important; }
        }
      `}</style>

      <ParticleBackground />

      <div className="cmd-grid-bg" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header language={language} setLanguage={setLanguage} t={t} />

        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 16px 80px' }}>

          {/* ── Page Title ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 28 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00FF88', boxShadow: '0 0 8px #00FF88', animation: 'pulse 2s ease-out infinite' }} />
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#FFD700', letterSpacing: 3, textTransform: 'uppercase' }}>
                  COMMAND CENTER
                </span>
              </div>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff22', letterSpacing: 1 }}>v2.0</span>
            </div>
            <h1 className="cmd-page-title" style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#ffffff',
              textShadow: '0 0 40px rgba(255,215,0,0.1)',
              margin: 0,
              letterSpacing: 0.5,
            }}>
              エージェント司令室
            </h1>
            <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#ffffff33', marginTop: 5 }}>
              最終更新: {lastUpdated.toLocaleTimeString('ja-JP')}
              <span style={{ marginLeft: 8, color: '#FFD70044' }}>— 30秒ごとに自動更新</span>
            </p>
          </motion.div>

          {/* ── First View: Stats Overview ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="cmd-stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              marginBottom: 28,
            }}
          >
            {/* Supabase Records */}
            <TiltCard className="cmd-stat-card" glowColor="#FFD700">
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff33', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
                  SUPABASE RECORDS
                </div>
                <div style={{ fontSize: 34, fontWeight: 700, fontFamily: 'monospace', color: '#FFD700', lineHeight: 1, textShadow: '0 0 20px rgba(255,215,0,0.15)' }}>
                  <AnimatedCounter value={memoryCount} />
                </div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#00FF8877', marginTop: 6 }}>
                  +{todayCount} today
                </div>
              </div>
            </TiltCard>

            {/* Active Agents */}
            <TiltCard className="cmd-stat-card" glowColor="#00FF88">
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff33', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
                  ACTIVE AGENTS
                </div>
                <div style={{ fontSize: 34, fontWeight: 700, fontFamily: 'monospace', color: '#00FF88', lineHeight: 1, textShadow: '0 0 20px rgba(0,255,136,0.15)' }}>
                  <AnimatedCounter value={activeCount} />
                </div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff33', marginTop: 6 }}>
                  / {AGENTS.length} total
                </div>
              </div>
            </TiltCard>

            {/* Mac Mini 大 */}
            <TiltCard className="cmd-stat-card" glowColor="#3B82F6">
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff33', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
                  MAC MINI 大
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PulseDot color="#00FF88" active={true} />
                  <span style={{ fontSize: 15, fontWeight: 600, fontFamily: 'monospace', color: '#00FF88' }}>
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff33', marginTop: 8 }}>
                  OSHI Jr 24h稼働中
                </div>
              </div>
            </TiltCard>

            {/* Mac Mini 小 */}
            <TiltCard className="cmd-stat-card" glowColor="#F59E0B">
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff33', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
                  MAC MINI 小
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PulseDot color="#F59E0B" active={false} />
                  <span style={{ fontSize: 15, fontWeight: 600, fontFamily: 'monospace', color: '#F59E0B' }}>
                    STANDBY
                  </span>
                </div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff33', marginTop: 8 }}>
                  準備中 — 増設予定
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* ── Second View: Agent Cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            style={{ marginBottom: 28 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#FFD700', letterSpacing: 2, textTransform: 'uppercase' }}>
                  AGENTS
                </span>
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff18' }}>
                  ─────────────────────
                </span>
              </div>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff22' }}>
                稼働中が上 / 待機中が下
              </span>
            </div>

            <div
              className="cmd-agents-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 12,
              }}
            >
              {sortedAgents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                >
                  <TiltCard
                    className="cmd-card"
                    glowColor={agent.color}
                  >
                    <div style={{
                      padding: '16px 20px',
                      borderLeft: `2px solid ${agent.status === 'active' ? agent.color + '88' : 'transparent'}`,
                    }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <PulseDot
                            color={STATUS_MAP[agent.status].dotColor}
                            active={agent.status === 'active'}
                          />
                          <span style={{
                            fontSize: 14,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: agent.status === 'active' ? agent.color : '#ffffffcc',
                            textShadow: agent.status === 'active' ? `0 0 10px ${agent.color}33` : 'none',
                          }}>
                            {agent.name}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 9,
                          fontFamily: 'monospace',
                          padding: '3px 8px',
                          borderRadius: 4,
                          backgroundColor: STATUS_MAP[agent.status].bg,
                          color: STATUS_MAP[agent.status].dotColor,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          border: `1px solid ${STATUS_MAP[agent.status].dotColor}22`,
                        }}>
                          {STATUS_MAP[agent.status].label}
                        </span>
                      </div>

                      {/* Task */}
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#ffffff77', marginBottom: 8, lineHeight: 1.5 }}>
                        {agent.task}
                      </div>

                      {/* Phase */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff22', letterSpacing: 1, textTransform: 'uppercase' }}>PHASE:</span>
                        <span style={{ fontSize: 10, fontFamily: 'monospace', color: agent.status === 'active' ? agent.color + 'cc' : '#ffffff44' }}>
                          {agent.phase}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <ProgressBar value={agent.progress} color={agent.color} />

                      {/* Last action + Updated */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff22' }}>LAST:</span>
                          <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff55', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {agent.lastAction}
                          </span>
                        </div>
                        <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff22', flexShrink: 0 }}>
                          {agent.updatedAt}
                        </span>
                      </div>

                      {/* Progress % */}
                      <div style={{ marginTop: 4, textAlign: 'right' }}>
                        <span style={{ fontSize: 9, fontFamily: 'monospace', color: agent.status === 'active' ? agent.color + '88' : '#ffffff22' }}>
                          {agent.progress}%
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#FFD700', letterSpacing: 2, textTransform: 'uppercase' }}>
                LATEST MEMORIES
              </span>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff18' }}>
                ─────────────────────
              </span>
            </div>

            <TiltCard className="cmd-card" glowColor="#FFD700">
              <div style={{ padding: 0 }}>
                {/* Table header */}
                <div
                  className="cmd-memory-table"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 130px 90px 150px',
                    padding: '10px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {[
                    { label: 'TITLE', hide: false },
                    { label: 'CATEGORY', hide: false },
                    { label: 'IMPORTANCE', hide: true },
                    { label: 'CREATED', hide: true },
                  ].map(h => (
                    <span
                      key={h.label}
                      className={h.hide ? 'cmd-memory-col-hide' : ''}
                      style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff22', letterSpacing: 2, textTransform: 'uppercase' }}
                    >
                      {h.label}
                    </span>
                  ))}
                </div>

                <AnimatePresence>
                  {memories.map((mem, i) => (
                    <motion.div
                      key={mem.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="cmd-memory-row cmd-memory-table"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 130px 90px 150px',
                        padding: '11px 20px',
                        borderBottom: i < memories.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{
                        fontSize: 12,
                        fontFamily: 'monospace',
                        color: '#ffffffcc',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        paddingRight: 12,
                      }}>
                        {mem.title}
                      </span>
                      <span style={{
                        fontSize: 9,
                        fontFamily: 'monospace',
                        padding: '2px 7px',
                        borderRadius: 3,
                        backgroundColor:
                          mem.category === 'critical_infrastructure' ? '#FFD70012' :
                          mem.category === 'failure_log' ? '#FF444412' :
                          mem.category === 'improvement' ? '#00FF8812' :
                          '#3B82F612',
                        color:
                          mem.category === 'critical_infrastructure' ? '#FFD700' :
                          mem.category === 'failure_log' ? '#FF6666' :
                          mem.category === 'improvement' ? '#00FF88' :
                          '#60A5FA',
                        display: 'inline-block',
                        width: 'fit-content',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 120,
                      }}>
                        {mem.category}
                      </span>
                      <span
                        className="cmd-memory-col-hide"
                        style={{
                          fontSize: 10,
                          fontFamily: 'monospace',
                          color: mem.importance === 'critical' ? '#FF6666' : '#ffffff44',
                          fontWeight: mem.importance === 'critical' ? 700 : 400,
                        }}
                      >
                        {mem.importance}
                      </span>
                      <span
                        className="cmd-memory-col-hide"
                        style={{ fontSize: 10, fontFamily: 'monospace', color: '#ffffff33' }}
                      >
                        {new Date(mem.created_at).toLocaleString('ja-JP', {
                          month: '2-digit', day: '2-digit',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {memories.length === 0 && (
                  <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#ffffff22' }}>
                      Supabase接続待ち — フォールバックデータを表示中
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
            transition={{ delay: 0.7 }}
            style={{ marginTop: 48, textAlign: 'center' }}
          >
            <p style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff18', letterSpacing: 1 }}>
              COMMAND CENTER v2.0 — OSHI WORLD — 2026-03-09
            </p>
            <p style={{ fontSize: 9, fontFamily: 'monospace', color: '#ffffff10', marginTop: 3 }}>
              OSHIの軍団を作る
            </p>
          </motion.div>

        </main>
      </div>
    </div>
  );
}
