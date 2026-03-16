import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const MEMORY_VAULT_URL = '';
const MEMORY_VAULT_API_KEY = import.meta.env.VITE_MEMORY_VAULT_API_KEY || '';
const GOLD = '#D4A853';
const CYAN = '#00FFFF';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ContentEntry {
  id: string;
  agent_id: string;
  memory_type: string;
  content: Record<string, unknown>;
  summary: string;
  importance: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface ContentApiResponse {
  data: ContentEntry[];
  total: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDateTimeJP(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTitle(entry: ContentEntry): string {
  const c = entry.content;
  if (typeof c.title === 'string' && c.title) return c.title;
  if (typeof c.concept === 'string' && c.concept) return c.concept;
  if (typeof c.feature === 'string' && c.feature) return c.feature;
  if (entry.summary) return entry.summary.slice(0, 60);
  return 'Untitled';
}

function getImportanceColor(importance: number): string {
  if (importance >= 9) return '#FF6B6B';
  if (importance >= 7) return GOLD;
  if (importance >= 5) return '#6BB5FF';
  return '#888888';
}

function getImportanceLabel(importance: number): string {
  if (importance >= 9) return 'CRITICAL';
  if (importance >= 7) return 'HIGH';
  if (importance >= 5) return 'MEDIUM';
  return 'LOW';
}

// ─────────────────────────────────────────────
// Tag Badge Component
// ─────────────────────────────────────────────
function TagBadge({ tag }: { tag: string }) {
  const isHighlight = tag === 'oshi-content-room' || tag === 'never_delete';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        fontSize: 10,
        fontFamily: 'monospace',
        color: isHighlight ? GOLD : '#ffffff77',
        background: isHighlight ? `${GOLD}15` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${isHighlight ? `${GOLD}33` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 4,
        letterSpacing: 0.5,
      }}
    >
      {tag}
    </span>
  );
}

// ─────────────────────────────────────────────
// Content Card Component
// ─────────────────────────────────────────────
function ContentCard({
  entry,
  index,
  isExpanded,
  onToggle,
}: {
  entry: ContentEntry;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const title = getTitle(entry);
  const impColor = getImportanceColor(entry.importance);
  const impLabel = getImportanceLabel(entry.importance);

  // Extract detail fields from content
  const contentFields = Object.entries(entry.content).filter(
    ([key, val]) =>
      key !== 'title' &&
      key !== 'concept' &&
      typeof val === 'string' &&
      val.length > 0,
  );

  const arrayFields = Object.entries(entry.content).filter(
    ([, val]) => Array.isArray(val),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      style={{
        background: 'rgba(15, 21, 53, 0.6)',
        border: `1px solid ${isExpanded ? `${GOLD}33` : 'rgba(212, 168, 83, 0.12)'}`,
        borderRadius: 12,
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Card Header - Clickable */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Top Row: Importance + Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Importance indicator */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: impColor,
                boxShadow: `0 0 8px ${impColor}66`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontFamily: 'monospace',
                color: impColor,
                letterSpacing: 2,
                fontWeight: 600,
              }}
            >
              {impLabel} ({entry.importance})
            </span>
            <span
              style={{
                fontSize: 9,
                fontFamily: 'monospace',
                color: '#ffffff33',
                letterSpacing: 1,
              }}
            >
              {entry.memory_type.toUpperCase()}
            </span>
          </div>
          <span
            style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: '#ffffff33',
            }}
          >
            {formatDateTimeJP(entry.created_at)}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Noto Sans JP', sans-serif",
            color: '#ffffffdd',
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {title}
        </div>

        {/* Summary */}
        <div
          style={{
            fontSize: 13,
            fontFamily: "'Noto Sans JP', sans-serif",
            color: '#ffffff88',
            lineHeight: 1.7,
            wordBreak: 'break-word',
          }}
        >
          {entry.summary}
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            marginTop: 2,
          }}
        >
          {entry.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* Expand indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: '#ffffff33',
              transition: 'transform 0.2s ease',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 24px 20px',
                borderTop: '1px solid rgba(212, 168, 83, 0.08)',
              }}
            >
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* String fields */}
                {contentFields.map(([key, val]) => (
                  <div key={key}>
                    <div
                      style={{
                        fontSize: 9,
                        fontFamily: 'monospace',
                        color: `${GOLD}88`,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      {key}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontFamily: "'Noto Sans JP', sans-serif",
                        color: '#ffffffbb',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {String(val)}
                    </div>
                  </div>
                ))}

                {/* Array fields */}
                {arrayFields.map(([key, val]) => (
                  <div key={key}>
                    <div
                      style={{
                        fontSize: 9,
                        fontFamily: 'monospace',
                        color: `${GOLD}88`,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        marginBottom: 6,
                      }}
                    >
                      {key}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      {(val as string[]).map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 8,
                            fontSize: 12,
                            fontFamily: "'Noto Sans JP', sans-serif",
                            color: '#ffffffaa',
                            lineHeight: 1.6,
                          }}
                        >
                          <span
                            style={{
                              color: GOLD,
                              fontSize: 8,
                              marginTop: 5,
                              flexShrink: 0,
                            }}
                          >
                            ●
                          </span>
                          {String(item)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Meta info */}
                <div
                  style={{
                    marginTop: 8,
                    paddingTop: 12,
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: '#ffffff33',
                    }}
                  >
                    ID: {entry.id.slice(0, 8)}...
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: '#ffffff33',
                    }}
                  >
                    Agent: {entry.agent_id}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: '#ffffff33',
                    }}
                  >
                    Updated: {formatDateTimeJP(entry.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Filter Bar Component
// ─────────────────────────────────────────────
function FilterBar({
  sortBy,
  onSortChange,
  totalCount,
}: {
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}) {
  const sortOptions = [
    { value: 'created_at:desc', label: '新しい順' },
    { value: 'created_at:asc', label: '古い順' },
    { value: 'importance:desc', label: '重要度 高→低' },
    { value: 'importance:asc', label: '重要度 低→高' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontFamily: 'monospace',
          color: '#ffffff44',
        }}
      >
        {totalCount} entries
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            style={{
              padding: '4px 10px',
              fontSize: 10,
              fontFamily: "'Noto Sans JP', monospace",
              color: sortBy === opt.value ? GOLD : '#ffffff55',
              background:
                sortBy === opt.value ? `${GOLD}11` : 'transparent',
              border: `1px solid ${sortBy === opt.value ? `${GOLD}33` : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (sortBy !== opt.value) {
                e.currentTarget.style.color = '#ffffffaa';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (sortBy !== opt.value) {
                e.currentTarget.style.color = '#ffffff55';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Stats Sidebar Component
// ─────────────────────────────────────────────
function StatsSidebar({ entries }: { entries: ContentEntry[] }) {
  const totalEntries = entries.length;
  const avgImportance =
    totalEntries > 0
      ? (
          entries.reduce((sum, e) => sum + e.importance, 0) / totalEntries
        ).toFixed(1)
      : '0';

  // Count by memory_type
  const typeCounts: Record<string, number> = {};
  entries.forEach((e) => {
    typeCounts[e.memory_type] = (typeCounts[e.memory_type] || 0) + 1;
  });

  // Collect all unique tags (excluding oshi-content-room)
  const tagCounts: Record<string, number> = {};
  entries.forEach((e) => {
    e.tags.forEach((tag) => {
      if (tag !== 'oshi-content-room') {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Stats Card */}
      <div
        style={{
          background: 'rgba(15, 21, 53, 0.6)',
          border: '1px solid rgba(212, 168, 83, 0.15)',
          borderRadius: 12,
          padding: '16px 14px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontFamily: 'monospace',
            color: `${GOLD}88`,
            letterSpacing: 2,
            marginBottom: 14,
            textTransform: 'uppercase',
          }}
        >
          STATISTICS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: GOLD,
                textShadow: `0 0 20px ${GOLD}33`,
              }}
            >
              {totalEntries}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "'Noto Sans JP', sans-serif",
                color: '#ffffff44',
                marginTop: 2,
              }}
            >
              コンテンツ素材
            </div>
          </div>
          <div
            style={{
              height: 1,
              background: 'rgba(255,255,255,0.04)',
            }}
          />
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                fontFamily: 'monospace',
                color: '#ffffffcc',
              }}
            >
              {avgImportance}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "'Noto Sans JP', sans-serif",
                color: '#ffffff44',
                marginTop: 2,
              }}
            >
              平均重要度
            </div>
          </div>
        </div>
      </div>

      {/* Type Distribution */}
      <div
        style={{
          background: 'rgba(15, 21, 53, 0.6)',
          border: '1px solid rgba(212, 168, 83, 0.15)',
          borderRadius: 12,
          padding: '16px 14px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontFamily: 'monospace',
            color: `${GOLD}88`,
            letterSpacing: 2,
            marginBottom: 12,
            textTransform: 'uppercase',
          }}
        >
          MEMORY TYPES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.entries(typeCounts).map(([type, count]) => (
            <div
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 0',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: '#ffffff88',
                }}
              >
                {type}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: GOLD,
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tags */}
      {topTags.length > 0 && (
        <div
          style={{
            background: 'rgba(15, 21, 53, 0.6)',
            border: '1px solid rgba(212, 168, 83, 0.15)',
            borderRadius: 12,
            padding: '16px 14px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: `${GOLD}88`,
              letterSpacing: 2,
              marginBottom: 12,
              textTransform: 'uppercase',
            }}
          >
            TOP TAGS
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            {topTags.map(([tag, count]) => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  color: '#ffffff77',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 4,
                }}
              >
                {tag}
                <span style={{ color: `${GOLD}88`, fontSize: 9 }}>
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Content Room Page
// ─────────────────────────────────────────────
export default function ContentRoom() {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('created_at:desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const t: Record<string, string> = {
    title: 'Memory Vault',
    subtitle:
      'エージェントの記憶を安全に保管・管理するためのダッシュボードです。',
  };

  // Fetch content room entries
  const fetchEntries = useCallback(async (sort: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${MEMORY_VAULT_URL}/api/memories?tags=oshi-content-room&sort=${sort}&limit=100`,
        {
          headers: MEMORY_VAULT_API_KEY
            ? { Authorization: `Bearer ${MEMORY_VAULT_API_KEY}` }
            : {},
        },
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: ContentApiResponse = await res.json();
      setEntries(data.data);
    } catch (err) {
      console.error('Failed to fetch content room:', err);
      setError('コンテンツの取得に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries(sortBy);
  }, [sortBy, fetchEntries]);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
  }, []);

  const handleToggleExpand = useCallback(
    (id: string) => {
      setExpandedId((prev) => (prev === id ? null : id));
    },
    [],
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes softPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <Header language={language} setLanguage={setLanguage} t={t} />

      <main
        style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 80px' }}
      >
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 28 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: GOLD,
                  boxShadow: `0 0 8px ${GOLD}`,
                  animation: 'softPulse 2s ease-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'monospace',
                  color: GOLD,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                CONTENT ROOM
              </span>
            </div>
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: "'Noto Sans JP', monospace",
              color: '#ffffff',
              textShadow: `0 0 40px ${GOLD}11`,
              margin: 0,
              letterSpacing: 0.5,
            }}
          >
            コンテンツルーム
          </h1>
          <p
            style={{
              fontSize: 12,
              fontFamily: "'Noto Sans JP', sans-serif",
              color: '#ffffff44',
              marginTop: 6,
            }}
          >
            OSHIが学んだ知識・リサーチ・コンテンツ素材の一覧です。発信用に変換可能なナレッジベース。
          </p>
        </motion.div>

        {/* Main Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 260px',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* Left: Content List */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {loading ? (
              <div
                style={{
                  background: 'rgba(15, 21, 53, 0.6)',
                  border: '1px solid rgba(212, 168, 83, 0.15)',
                  borderRadius: 12,
                  padding: '60px 28px',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    color: '#ffffff44',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      animation: 'spin 1s linear infinite',
                      marginRight: 8,
                    }}
                  >
                    ⟳
                  </span>
                  読み込み中...
                </div>
              </div>
            ) : error ? (
              <div
                style={{
                  background: 'rgba(15, 21, 53, 0.6)',
                  border: '1px solid rgba(255, 100, 100, 0.2)',
                  borderRadius: 12,
                  padding: '40px 28px',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    color: '#ff8888',
                  }}
                >
                  {error}
                </div>
                <button
                  onClick={() => fetchEntries(sortBy)}
                  style={{
                    marginTop: 16,
                    padding: '8px 20px',
                    fontSize: 12,
                    fontFamily: "'Noto Sans JP', monospace",
                    color: GOLD,
                    background: `${GOLD}11`,
                    border: `1px solid ${GOLD}33`,
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  再試行
                </button>
              </div>
            ) : entries.length === 0 ? (
              <div
                style={{
                  background: 'rgba(15, 21, 53, 0.6)',
                  border: '1px solid rgba(212, 168, 83, 0.15)',
                  borderRadius: 12,
                  padding: '60px 28px',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>📝</div>
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    color: '#ffffff66',
                  }}
                >
                  Coming Soon
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    color: '#ffffff33',
                    marginTop: 8,
                  }}
                >
                  コンテンツ素材はまだ登録されていません
                </div>
              </div>
            ) : (
              <>
                <FilterBar
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  totalCount={entries.length}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {entries.map((entry, index) => (
                    <ContentCard
                      key={entry.id}
                      entry={entry}
                      index={index}
                      isExpanded={expandedId === entry.id}
                      onToggle={() => handleToggleExpand(entry.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Right: Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <StatsSidebar entries={entries} />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          marginTop: 64,
          padding: '32px 0',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 16px',
            textAlign: 'center',
            fontSize: 12,
            color: CYAN,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <p>Oshi Labs Animation Studio | oshilabs.xyz</p>
        </div>
      </footer>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .content-room-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
