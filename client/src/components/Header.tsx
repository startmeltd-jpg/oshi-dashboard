import { Link, useLocation } from 'wouter';

interface HeaderProps {
  language: 'ja' | 'en';
  setLanguage: (lang: 'ja' | 'en') => void;
  t: Record<string, string>;
}

export default function Header({ language, setLanguage, t }: HeaderProps) {
  const [location] = useLocation();
  const isAkashic = location === '/akashic';

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
          <nav className="flex items-center gap-1">
            <Link href="/">
              <button
                className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider border transition-all duration-200"
                style={{
                  color: !isAkashic ? '#00FF00' : '#ffffff55',
                  borderColor: !isAkashic ? '#00FF0066' : 'transparent',
                  backgroundColor: !isAkashic ? '#00FF0011' : 'transparent',
                  textShadow: !isAkashic ? '0 0 8px #00FF00' : 'none',
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
