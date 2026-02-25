interface MemoryStatsSectionProps {
  data: { rules: number; knowledge: number; trivia: number };
  data_uptime: { day: number; origin: string };
  t: Record<string, string>;
}

export default function MemoryStatsSection({ data, data_uptime, t }: MemoryStatsSectionProps) {
  return (
    <div
      className="border border-foreground/50 p-6 backdrop-blur-sm"
      style={{
        borderColor: '#00FF00',
        backgroundColor: 'rgba(15, 21, 53, 0.5)',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)',
      }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
        {t.memory || 'Memory'}
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: '#00FFFF' }}>
            {t.rules || 'Rules'}
          </span>
          <span className="font-bold text-lg" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
            {data.rules}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: '#00FFFF' }}>
            {t.knowledge || 'Knowledge'}
          </span>
          <span className="font-bold text-lg" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
            {data.knowledge}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: '#00FFFF' }}>
            {t.trivia || 'Trivia'}
          </span>
          <span className="font-bold text-lg" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
            {data.trivia}
          </span>
        </div>
      </div>

      <div className="border-t border-foreground/20 pt-4" style={{ borderColor: 'rgba(0, 255, 0, 0.2)' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: '#00FFFF' }}>
            {t.uptime || 'Uptime'}
          </span>
          <span className="font-bold" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
            {t.day || 'Day'} {data_uptime.day}
          </span>
        </div>
        <p className="text-xs" style={{ color: '#666666' }}>
          {t.origin || 'Origin'}: {data_uptime.origin}
        </p>
      </div>
    </div>
  );
}
