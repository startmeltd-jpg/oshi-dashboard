interface AirdropsQuestSectionProps {
  data: {
    users: number;
    countries: number;
    verifiedPct: number;
    points: number;
    daysActive: number;
    topCountries: Array<{ flag: string; name: string; count: number }>;
  };
  t: Record<string, string>;
}

export default function AirdropsQuestSection({ data, t }: AirdropsQuestSectionProps) {
  const GOLD = '#f59e0b';
  const GOLD_DIM = '#d97706';

  return (
    <div
      className="border p-6 backdrop-blur-sm"
      style={{
        borderColor: GOLD,
        backgroundColor: 'rgba(15, 21, 53, 0.5)',
        boxShadow: `0 0 20px ${GOLD}22`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: GOLD, boxShadow: `0 0 10px ${GOLD}` }}
        />
        <h3
          className="text-lg font-bold tracking-widest uppercase"
          style={{ color: GOLD, textShadow: `0 0 10px ${GOLD}` }}
        >
          {t.airdropsquest || 'AirdropsQuest KPI'}
        </h3>
        <a
          href="https://analytics.airdropsquest.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs font-mono px-2 py-1 border transition-all duration-200 hover:opacity-80"
          style={{ color: GOLD, borderColor: GOLD + '66' }}
        >
          LIVE →
        </a>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div
          className="p-3 border text-center"
          style={{ borderColor: GOLD + '44', backgroundColor: GOLD + '11' }}
        >
          <div className="text-2xl font-bold font-mono" style={{ color: GOLD, textShadow: `0 0 8px ${GOLD}` }}>
            {data.users.toLocaleString()}
          </div>
          <div className="text-xs mt-1 font-mono" style={{ color: GOLD_DIM }}>
            {t.users || 'USERS'}
          </div>
        </div>
        <div
          className="p-3 border text-center"
          style={{ borderColor: GOLD + '44', backgroundColor: GOLD + '11' }}
        >
          <div className="text-2xl font-bold font-mono" style={{ color: GOLD, textShadow: `0 0 8px ${GOLD}` }}>
            {data.countries}
          </div>
          <div className="text-xs mt-1 font-mono" style={{ color: GOLD_DIM }}>
            {t.countries || 'COUNTRIES'}
          </div>
        </div>
        <div
          className="p-3 border text-center"
          style={{ borderColor: GOLD + '44', backgroundColor: GOLD + '11' }}
        >
          <div className="text-2xl font-bold font-mono" style={{ color: GOLD, textShadow: `0 0 8px ${GOLD}` }}>
            {data.verifiedPct}%
          </div>
          <div className="text-xs mt-1 font-mono" style={{ color: GOLD_DIM }}>
            {t.verified || 'VERIFIED'}
          </div>
        </div>
        <div
          className="p-3 border text-center"
          style={{ borderColor: GOLD + '44', backgroundColor: GOLD + '11' }}
        >
          <div className="text-xl font-bold font-mono" style={{ color: GOLD, textShadow: `0 0 8px ${GOLD}` }}>
            {(data.points / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-xs mt-1 font-mono" style={{ color: GOLD_DIM }}>
            {t.points || 'POINTS'}
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="space-y-2">
        <div className="text-xs font-mono mb-2" style={{ color: GOLD_DIM }}>
          TOP 3 COUNTRIES
        </div>
        {data.topCountries.map((c, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{c.flag}</span>
              <span className="text-xs font-mono" style={{ color: '#ffffff99' }}>
                {c.name}
              </span>
            </div>
            <span className="text-xs font-bold font-mono" style={{ color: GOLD }}>
              {c.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Days Active */}
      <div
        className="mt-4 pt-3 border-t flex justify-between items-center"
        style={{ borderColor: GOLD + '33' }}
      >
        <span className="text-xs font-mono" style={{ color: GOLD_DIM }}>
          {t.daysActive || 'DAYS ACTIVE'}
        </span>
        <span className="text-sm font-bold font-mono" style={{ color: GOLD }}>
          Day {data.daysActive}
        </span>
      </div>
    </div>
  );
}
