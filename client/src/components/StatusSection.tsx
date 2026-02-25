interface StatusSectionProps {
  data: {
    name: string;
    state: string;
    organization: string;
    taskProgress: number;
    currentTask: string;
  };
  t: Record<string, string>;
}

export default function StatusSection({ data, t }: StatusSectionProps) {
  return (
    <div
      className="border border-foreground/50 p-6 backdrop-blur-sm"
      style={{
        borderColor: '#00FF00',
        backgroundColor: 'rgba(15, 21, 53, 0.5)',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Status Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: '#00FF00', boxShadow: '0 0 10px #00FF00' }}
            />
            <span className="text-sm font-semibold" style={{ color: '#00FFFF' }}>
              {data.state}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
            {data.name}
          </h2>
          <p className="text-sm" style={{ color: '#00FFFF' }}>
            {data.organization}
          </p>
        </div>

        {/* Right: Task Progress */}
        <div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold" style={{ color: '#00FFFF' }}>
                {t.task || 'Task'}
              </span>
              <span className="text-lg font-bold" style={{ color: '#00FF00' }}>
                {data.taskProgress}%
              </span>
            </div>
            <div
              className="w-full h-2 border border-foreground/30"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderColor: '#00FF00',
              }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${data.taskProgress}%`,
                  backgroundColor: '#00FF00',
                  boxShadow: '0 0 10px #00FF00',
                }}
              />
            </div>
          </div>
          <p className="text-sm" style={{ color: '#00FFFF' }}>
            {data.currentTask}
          </p>
        </div>
      </div>
    </div>
  );
}
