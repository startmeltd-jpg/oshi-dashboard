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
      <h3 className="text-lg font-bold mb-4" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
        {t.activityLog || 'Activity Log'}
      </h3>

      <div className="space-y-3">
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
