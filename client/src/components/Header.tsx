interface HeaderProps {
  language: 'ja' | 'en';
  setLanguage: (lang: 'ja' | 'en') => void;
  t: Record<string, string>;
}

export default function Header({ language, setLanguage, t }: HeaderProps) {
  return (
    <header className="border-b border-foreground/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold" style={{ textShadow: '0 0 20px #00FF00', color: '#00FF00' }}>
            ◉ OSHI
          </div>
          <div className="hidden sm:block text-sm" style={{ color: '#00FFFF' }}>
            {t.live || 'LIVE'} / {t.status || 'STATUS'}
          </div>
        </div>

        <button
          onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}
          className="px-4 py-2 border border-foreground/50 hover:border-foreground transition-all duration-300"
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
