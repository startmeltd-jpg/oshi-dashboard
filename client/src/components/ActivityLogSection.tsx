interface ActivityLogSectionProps {
  data: Array<{ id: number; time: string; message: string }>;
  t: Record<string, string>;
}

export default function ActivityLogSection({ data, t }: ActivityLogSectionProps) {
  return (
    <div
      className="border border-foreground/50 p-6 backdrop-blur-sm"
      style={{
        borderColor: '#00FF00',
        backgroundColor: 'rgba(15, 21, 53, 0.5)',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)',
      }}
    >
      <h3 className="text-lg font-bold mb-4 flex items-center justify-between" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
        <span>{t.activityLog || 'Activity Log'}</span>
        <span className="text-xs font-mono" style={{ color: '#00FFFF' }}>{data.length} entries</span>
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#00FF00 transparent' }}>
        {data.map((log) => (
          <div
            key={log.id}
            className="flex gap-4 pb-3 border-b border-foreground/20 last:border-b-0"
            style={{ borderColor: 'rgba(0, 255, 0, 0.2)' }}
          >
            <span className="font-mono text-sm font-bold whitespace-nowrap" style={{ color: '#00FFFF' }}>
              {log.time}
            </span>
            <span className="text-sm" style={{ color: '#00FF00' }}>
              —
            </span>
            <span className="text-sm flex-1" style={{ color: '#FFFFFF' }}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
