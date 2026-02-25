interface AgentsSectionProps {
  data: {
    active: number;
    total: number;
    list: Array<{ id: number; name: string; icon: string }>;
  };
  t: Record<string, string>;
}

export default function AgentsSection({ data, t }: AgentsSectionProps) {
  return (
    <div
      className="border border-foreground/50 p-6 backdrop-blur-sm"
      style={{
        borderColor: '#00FF00',
        backgroundColor: 'rgba(15, 21, 53, 0.5)',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)',
      }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
          {t.agents || 'Agents'}
        </h3>
        <p className="text-sm" style={{ color: '#00FFFF' }}>
          {data.active}/{data.total}
        </p>
      </div>

      <div className="space-y-3">
        {data.list.map((agent) => (
          <div
            key={agent.id}
            className="p-3 border border-foreground/30 hover:border-foreground/70 transition-all duration-300 cursor-pointer"
            style={{
              borderColor: '#00FFFF',
              backgroundColor: 'rgba(0, 255, 255, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.05)';
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{agent.icon}</span>
              <span className="font-semibold" style={{ color: '#00FF00' }}>
                {agent.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
