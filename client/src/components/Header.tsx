import { Link, useLocation } from 'wouter';
import { useState } from 'react';

interface HeaderProps {
  language: 'ja' | 'en';
  setLanguage: (lang: 'ja' | 'en') => void;
  t: Record<string, string>;
}

const NAV_ITEMS = [
  { path: '/', label: 'DASH', icon: '◉' },
  { path: '/akashic', label: 'アカシック', icon: '◈' },
  { path: '/history', label: 'まとめ', icon: '◆' },
  { path: '/timeline', label: 'タイムライン', icon: '✦' },
  { path: '/rules', label: 'ルール', icon: '⚙' },
  { path: '/anime-rules', label: 'アニメ技法', icon: '★' },
  { path: '/command', label: '司令室', icon: '⌘' },
  { path: '/diary', label: '日記', icon: '📖' },
  { path: '/data-policy', label: 'ポリシー', icon: '🛡' },
];

export default function Header({ language, setLanguage, t }: HeaderProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
      }}>
        {/* Logo */}
        <Link href="/">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}>
            <span style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#D4A853',
              letterSpacing: '-0.02em',
              fontFamily: "'Inter', sans-serif",
            }}>
              OSHI
            </span>
            <span style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: 1,
              marginTop: 2,
            }}>
              WORLD
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          {NAV_ITEMS.map(item => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <button
                  style={{
                    padding: '6px 12px',
                    fontSize: 11,
                    fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#D4A853' : 'rgba(255,255,255,0.4)',
                    background: isActive ? 'rgba(212, 168, 83, 0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ marginRight: 4, fontSize: 10 }}>{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 16,
                      height: 2,
                      background: '#D4A853',
                      borderRadius: 1,
                    }} />
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}
          style={{
            padding: '5px 14px',
            fontSize: 11,
            fontFamily: 'monospace',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 168, 83, 0.3)';
            e.currentTarget.style.color = '#D4A853';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
          }}
        >
          {language === 'ja' ? 'JA' : 'EN'}
        </button>
      </div>
    </header>
  );
}
