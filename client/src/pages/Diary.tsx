import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
// In production, API is on the same domain. In dev, Vite proxy handles /api.
const MEMORY_VAULT_URL = '';
const MEMORY_VAULT_API_KEY = import.meta.env.VITE_MEMORY_VAULT_API_KEY || '';
const GOLD = '#D4A853';
const CYAN = '#00FFFF';
const GREEN = '#00FF88';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface DiaryEntry {
  id: string;
  content: {
    diary_date: string;
    text: string;
    [key: string]: unknown;
  };
  summary: string;
  importance: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface DiaryApiResponse {
  data: DiaryEntry[];
  total: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDateJP(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[d.getDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTodayString(): string {
  // JST (UTC+9)
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return toDateString(jst);
}

// ─────────────────────────────────────────────
// Mini Calendar Component
// ─────────────────────────────────────────────
function MiniCalendar({
  selectedDate,
  onSelectDate,
  diaryDates,
}: {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  diaryDates: Set<string>;
}) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date(selectedDate + 'T00:00:00');
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  const prevMonth = () => {
    setViewDate(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setViewDate(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = `${viewDate.year}年${viewDate.month + 1}月`;

  return (
    <div style={{
      background: 'rgba(15, 21, 53, 0.6)',
      border: '1px solid rgba(212, 168, 83, 0.15)',
      borderRadius: 12,
      padding: '16px 14px',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Month Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <button onClick={prevMonth} style={{
          background: 'none', border: 'none', color: GOLD, cursor: 'pointer',
          fontSize: 18, padding: '4px 8px', borderRadius: 4,
        }}>
          ‹
        </button>
        <span style={{
          fontSize: 13, fontWeight: 600, fontFamily: "'Noto Sans JP', sans-serif",
          color: '#ffffffcc',
        }}>
          {monthLabel}
        </span>
        <button onClick={nextMonth} style={{
          background: 'none', border: 'none', color: GOLD, cursor: 'pointer',
          fontSize: 18, padding: '4px 8px', borderRadius: 4,
        }}>
          ›
        </button>
      </div>

      {/* Weekday Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {weekdays.map(w => (
          <div key={w} style={{
            textAlign: 'center', fontSize: 10, fontFamily: 'monospace',
            color: w === '日' ? '#ff6b6b88' : w === '土' ? '#6bb5ff88' : '#ffffff44',
            padding: '4px 0',
          }}>
            {w}
          </div>
        ))}
      </div>

      {/* Day Cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = dateStr === selectedDate;
          const hasDiary = diaryDates.has(dateStr);
          const isToday = dateStr === getTodayString();

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              style={{
                width: '100%',
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontFamily: 'monospace',
                border: isSelected ? `1px solid ${GOLD}` : isToday ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid transparent',
                borderRadius: 6,
                background: isSelected ? `${GOLD}22` : 'transparent',
                color: isSelected ? GOLD : hasDiary ? '#ffffffcc' : '#ffffff55',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#ffffffcc';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = hasDiary ? '#ffffffcc' : '#ffffff55';
                }
              }}
            >
              {day}
              {hasDiary && (
                <div style={{
                  width: 4, height: 4, borderRadius: '50%',
                  backgroundColor: GOLD,
                  marginTop: 1,
                  boxShadow: `0 0 4px ${GOLD}88`,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Diary Content Display
// ─────────────────────────────────────────────
function DiaryContent({
  entry,
  onRegenerate,
  isRegenerating,
}: {
  entry: DiaryEntry;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const lines = entry.content.text.split('\n');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'rgba(15, 21, 53, 0.6)',
        border: '1px solid rgba(212, 168, 83, 0.15)',
        borderRadius: 12,
        padding: '24px 28px',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingBottom: 14,
        borderBottom: '1px solid rgba(212, 168, 83, 0.1)',
      }}>
        <div>
          <div style={{
            fontSize: 9, fontFamily: 'monospace', color: `${GOLD}88`,
            letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4,
          }}>
            OSHI DIARY
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700, fontFamily: "'Noto Sans JP', sans-serif",
            color: '#ffffffdd',
          }}>
            {formatDateJP(entry.content.diary_date)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 9, fontFamily: 'monospace', color: '#ffffff33',
          }}>
            {new Date(entry.created_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
          </span>
        </div>
      </div>

      {/* Diary Text */}
      <div style={{
        fontSize: 14,
        lineHeight: 1.9,
        fontFamily: "'Noto Sans JP', sans-serif",
        color: '#ffffffcc',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {lines.map((line, i) => {
          // Section headers with emoji
          if (line.match(/^[🌟📚💭✨🎯]/)) {
            return (
              <div key={i} style={{
                fontSize: 15, fontWeight: 700, color: GOLD,
                marginTop: i > 0 ? 16 : 0, marginBottom: 6,
                textShadow: `0 0 10px ${GOLD}33`,
              }}>
                {line}
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={i} style={{ height: 8 }} />;
          }
          return <div key={i}>{line}</div>;
        })}
      </div>

      {/* Regenerate Button */}
      <div style={{
        marginTop: 24,
        paddingTop: 16,
        borderTop: '1px solid rgba(212, 168, 83, 0.1)',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          style={{
            padding: '8px 20px',
            fontSize: 12,
            fontFamily: "'Noto Sans JP', monospace",
            fontWeight: 500,
            color: isRegenerating ? '#ffffff44' : '#ffffff88',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            cursor: isRegenerating ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            if (!isRegenerating) {
              e.currentTarget.style.borderColor = `${GOLD}44`;
              e.currentTarget.style.color = GOLD;
              e.currentTarget.style.background = `${GOLD}08`;
            }
          }}
          onMouseLeave={e => {
            if (!isRegenerating) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#ffffff88';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }
          }}
        >
          {isRegenerating ? '生成中...' : 'もう一度生成する'}
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Generate Diary Prompt
// ─────────────────────────────────────────────
function GeneratePrompt({
  date,
  onGenerate,
  isGenerating,
}: {
  date: string;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'rgba(15, 21, 53, 0.6)',
        border: '1px solid rgba(212, 168, 83, 0.15)',
        borderRadius: 12,
        padding: '40px 28px',
        backdropFilter: 'blur(12px)',
        textAlign: 'center',
      }}
    >
      <div style={{
        fontSize: 40, marginBottom: 16,
      }}>
        📖
      </div>
      <div style={{
        fontSize: 16, fontWeight: 600, fontFamily: "'Noto Sans JP', sans-serif",
        color: '#ffffffcc', marginBottom: 8,
      }}>
        {formatDateJP(date)}
      </div>
      <div style={{
        fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
        color: '#ffffff66', marginBottom: 28,
      }}>
        この日の日記はまだ生成されていません
      </div>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        style={{
          padding: '12px 32px',
          fontSize: 14,
          fontFamily: "'Noto Sans JP', sans-serif",
          fontWeight: 600,
          color: isGenerating ? '#ffffff44' : GOLD,
          background: isGenerating ? 'rgba(255,255,255,0.02)' : `${GOLD}11`,
          border: `1px solid ${isGenerating ? 'rgba(255,255,255,0.05)' : GOLD + '44'}`,
          borderRadius: 8,
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isGenerating ? 'none' : `0 0 20px ${GOLD}11`,
        }}
        onMouseEnter={e => {
          if (!isGenerating) {
            e.currentTarget.style.background = `${GOLD}22`;
            e.currentTarget.style.boxShadow = `0 0 30px ${GOLD}22`;
          }
        }}
        onMouseLeave={e => {
          if (!isGenerating) {
            e.currentTarget.style.background = `${GOLD}11`;
            e.currentTarget.style.boxShadow = `0 0 20px ${GOLD}11`;
          }
        }}
      >
        {isGenerating ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
            日記を生成中...
          </span>
        ) : (
          'OSHIの日記を生成する'
        )}
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Diary Page
// ─────────────────────────────────────────────
export default function Diary() {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [diaryDates, setDiaryDates] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const t: Record<string, string> = {
    title: 'Memory Vault',
    subtitle: 'エージェントの記憶を安全に保管・管理するためのダッシュボードです。',
  };

  // Fetch all diary dates for calendar markers
  const fetchDiaryDates = useCallback(async () => {
    try {
      const res = await fetch(
        `${MEMORY_VAULT_URL}/api/memories?tags=diary&memory_type=custom&limit=200&sort=created_at:desc`,
        {
          headers: MEMORY_VAULT_API_KEY ? {
            'Authorization': `Bearer ${MEMORY_VAULT_API_KEY}`,
          } : {},
        },
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: DiaryApiResponse = await res.json();
      const dates = new Set<string>();
      data.data.forEach(entry => {
        if (entry.content?.diary_date) {
          dates.add(entry.content.diary_date);
        }
      });
      setDiaryDates(dates);
    } catch (err) {
      console.error('Failed to fetch diary dates:', err);
    }
  }, []);

  // Fetch diary for a specific date
  const fetchDiaryForDate = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    setCurrentEntry(null);
    try {
      const res = await fetch(
        `${MEMORY_VAULT_URL}/api/memories?tags=diary&memory_type=custom&search=${encodeURIComponent(date)}&limit=10&sort=created_at:desc`,
        {
          headers: MEMORY_VAULT_API_KEY ? {
            'Authorization': `Bearer ${MEMORY_VAULT_API_KEY}`,
          } : {},
        },
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: DiaryApiResponse = await res.json();

      // Find the entry matching the exact date
      const match = data.data.find(
        entry => entry.content?.diary_date === date
      );

      if (match) {
        setCurrentEntry(match);
      } else {
        setCurrentEntry(null);
      }
    } catch (err) {
      console.error('Failed to fetch diary:', err);
      setError('日記の取得に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDiaryDates();
    fetchDiaryForDate(selectedDate);
  }, []);

  // When date changes
  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
    fetchDiaryForDate(date);
  }, [fetchDiaryForDate]);

  // Generate diary (placeholder - shows message)
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Note: Diary generation requires LLM integration.
      // For now, show a message that generation needs to be triggered externally.
      await new Promise(resolve => setTimeout(resolve, 1500));
      setError('日記の生成はOSHIエージェントが行います。しばらくお待ちください。');
    } catch (err) {
      setError('日記の生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedDate]);

  // Regenerate diary
  const handleRegenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setError('日記の再生成はOSHIエージェントが行います。しばらくお待ちください。');
    } catch (err) {
      setError('日記の再生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedDate]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Header language={language} setLanguage={setLanguage} t={t} />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 80px' }}>
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: GOLD,
                boxShadow: `0 0 8px ${GOLD}`,
                animation: 'softPulse 2s ease-out infinite',
              }} />
              <span style={{
                fontSize: 10, fontFamily: 'monospace', color: GOLD,
                letterSpacing: 3, textTransform: 'uppercase',
              }}>
                OSHI DIARY
              </span>
            </div>
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 700, fontFamily: "'Noto Sans JP', monospace",
            color: '#ffffff',
            textShadow: `0 0 40px ${GOLD}11`,
            margin: 0, letterSpacing: 0.5,
          }}>
            OSHIの日記
          </h1>
          <p style={{
            fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif",
            color: '#ffffff44', marginTop: 6,
          }}>
            OSHIが毎日の出来事を振り返って書く日記です。カレンダーから日付を選んで読めます。
          </p>
        </motion.div>

        {/* Main Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 24,
          alignItems: 'start',
        }}>
          {/* Left: Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MiniCalendar
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              diaryDates={diaryDates}
            />

            {/* Diary dates list */}
            <div style={{
              marginTop: 16,
              background: 'rgba(15, 21, 53, 0.6)',
              border: '1px solid rgba(212, 168, 83, 0.15)',
              borderRadius: 12,
              padding: '14px',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{
                fontSize: 10, fontFamily: 'monospace', color: `${GOLD}88`,
                letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase',
              }}>
                RECENT ENTRIES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Array.from(diaryDates)
                  .sort((a, b) => b.localeCompare(a))
                  .slice(0, 10)
                  .map(date => (
                    <button
                      key={date}
                      onClick={() => handleSelectDate(date)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 10px',
                        fontSize: 12,
                        fontFamily: 'monospace',
                        color: date === selectedDate ? GOLD : '#ffffff77',
                        background: date === selectedDate ? `${GOLD}11` : 'transparent',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        if (date !== selectedDate) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.color = '#ffffffaa';
                        }
                      }}
                      onMouseLeave={e => {
                        if (date !== selectedDate) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#ffffff77';
                        }
                      }}
                    >
                      <span style={{
                        width: 4, height: 4, borderRadius: '50%',
                        backgroundColor: date === selectedDate ? GOLD : '#ffffff33',
                        flexShrink: 0,
                      }} />
                      {date}
                    </button>
                  ))}
                {diaryDates.size === 0 && (
                  <div style={{
                    fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif",
                    color: '#ffffff33', padding: '8px 0', textAlign: 'center',
                  }}>
                    まだ日記がありません
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Diary Content */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(15, 21, 53, 0.6)',
                    border: '1px solid rgba(212, 168, 83, 0.15)',
                    borderRadius: 12,
                    padding: '60px 28px',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontSize: 14, fontFamily: "'Noto Sans JP', sans-serif",
                    color: '#ffffff44',
                  }}>
                    <span style={{
                      display: 'inline-block',
                      animation: 'spin 1s linear infinite',
                      marginRight: 8,
                    }}>⟳</span>
                    読み込み中...
                  </div>
                </motion.div>
              ) : error && !currentEntry ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(15, 21, 53, 0.6)',
                    border: '1px solid rgba(255, 100, 100, 0.2)',
                    borderRadius: 12,
                    padding: '40px 28px',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
                    color: '#ff8888',
                  }}>
                    {error}
                  </div>
                </motion.div>
              ) : currentEntry ? (
                <div key={`entry-${currentEntry.id}`}>
                  <DiaryContent
                    entry={currentEntry}
                    onRegenerate={handleRegenerate}
                    isRegenerating={isGenerating}
                  />
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: 12,
                        padding: '10px 16px',
                        fontSize: 12,
                        fontFamily: "'Noto Sans JP', sans-serif",
                        color: '#ffaa44',
                        background: 'rgba(255, 170, 68, 0.08)',
                        border: '1px solid rgba(255, 170, 68, 0.15)',
                        borderRadius: 8,
                        textAlign: 'center',
                      }}
                    >
                      {error}
                    </motion.div>
                  )}
                </div>
              ) : (
                <GeneratePrompt
                  key={`generate-${selectedDate}`}
                  date={selectedDate}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        marginTop: 64,
        padding: '32px 0',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 16px',
          textAlign: 'center', fontSize: 12, color: CYAN,
          fontFamily: "'Inter', sans-serif",
        }}>
          <p>Oshi Labs Animation Studio | oshilabs.xyz</p>
        </div>
      </footer>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .diary-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
