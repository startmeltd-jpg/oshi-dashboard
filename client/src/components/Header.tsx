import { Link, useLocation } from 'wouter';

interface HeaderProps {
  language: 'ja' | 'en';
  setLanguage: (lang: 'ja' | 'en') => void;
  t: Record<string, string>;
}

export default function Header({ language, setLanguage, t }: HeaderProps) {
  const [location] = useLocation();
  const isAkashic = location === '/akashic';
  const isRules = location === '/rules';
  const isHistory = location === '/history';
  const isTimeline = location === '/timeline';

  return (
    <header className="border-b border-foreground/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/">
            <div
              className="text-2xl font-bold cursor-pointer transition-all duration-200"
              style={{ textShadow: '0 0 20px #00FF00', color: '#00FF00' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.textShadow = '0 0 30px #00FF00, 0 0 50px #00FF00';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.textShadow = '0 0 20px #00FF00';
              }}
            >
              ◉ OSHI
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 flex-wrap">
            <Link href="/">
              <button
                className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider border transition-all duration-200"
                style={{
                  color: location === '/' ? '#00FF00' : '#ffffff55',
                  borderColor: location === '/' ? '#00FF0066' : 'transparent',
                  backgroundColor: location === '/' ? '#00FF0011' : 'transparent',
                  textShadow: location === '/' ? '0 0 8px #00FF00' : 'none',
                }}
              >
                {t.live || 'LIVE'} DASH
              </button>
            </Link>
            <Link href="/akashic">
              <button
                className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider border transition-all duration-200"
                style={{
                  color: isAkashic ? '#a855f7' : '#ffffff55',
                  borderColor: isAkashic ? '#a855f766' : 'transparent',
                  backgroundColor: isAkashic ? '#a855f711' : 'transparent',
                  textShadow: isAkashic ? '0 0 8px #a855f7' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isAkashic) {
                    (e.currentTarget as HTMLElement).style.color = '#a855f7aa';
                    (e.currentTarget as HTMLElement).style.borderColor = '#a855f744';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isAkashic) {
                    (e.currentTarget as HTMLElement).style.color = '#ffffff55';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }
                }}
              >
                ◈ アカシックレコード
              </button>
            </Link>
            <Link href="/history">
              <button
                className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider border transition-all duration-200"
                style={{
                  color: isHistory ? '#FFD700' : '#ffffff55',
                  borderColor: isHistory ? '#FFD70066' : 'transparent',
                  backgroundColor: isHistory ? '#FFD70011' : 'transparent',
                  textShadow: isHistory ? '0 0 8px #FFD700' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isHistory) {
                    (e.currentTarget as HTMLElement).style.color = '#FFD700aa';
                    (e.currentTarget as HTMLElement).style.borderColor = '#FFD70044';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isHistory) {
                    (e.currentTarget as HTMLElement).style.color = '#ffffff55';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }
                }}
              >
                ◆ まとめ
              </button>
            </Link>
            <Link href="/timeline">
              <button
                className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider border transition-all duration-200"
                style={{
                  color: isTimeline ? '#F59E0B' : '#ffffff55',
                  borderColor: isTimeline ? '#F59E0B66' : 'transparent',
                  backgroundColor: isTimeline ? '#F59E0B11' : 'transparent',
                  textShadow: isTimeline ? '0 0 8px #F59E0B' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isTimeline) {
                    (e.currentTarget as HTMLElement).style.color = '#F59E0Baa';
                    (e.currentTarget as HTMLElement).style.borderColor = '#F59E0B44';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isTimeline) {
                    (e.currentTarget as HTMLElement).style.color = '#ffffff55';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }
                }}
              >
                ✦ タイムライン
              </button>
            </Link>
            <Link href="/rules">
              <button
                className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider border transition-all duration-200"
                style={{
                  color: isRules ? '#00FFFF' : '#ffffff55',
                  borderColor: isRules ? '#00FFFF66' : 'transparent',
                  backgroundColor: isRules ? '#00FFFF11' : 'transparent',
                  textShadow: isRules ? '0 0 8px #00FFFF' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isRules) {
                    (e.currentTarget as HTMLElement).style.color = '#00FFFFaa';
                    (e.currentTarget as HTMLElement).style.borderColor = '#00FFFF44';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isRules) {
                    (e.currentTarget as HTMLElement).style.color = '#ffffff55';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }
                }}
              >
                ⚙ ルール
              </button>
            </Link>
          </nav>
        </div>

        {/* Right: Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}
          className="px-4 py-2 border border-foreground/50 hover:border-foreground transition-all duration-300 flex-shrink-0"
          style={{
            color: '#00FFFF',
            borderColor: '#00FFFF',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {language === 'ja' ? 'JA' : 'EN'} / {language === 'ja' ? 'EN' : 'JA'}
        </button>
      </div>
    </header>
  );
}
