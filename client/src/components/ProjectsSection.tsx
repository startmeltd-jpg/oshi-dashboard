interface ProjectsSectionProps {
  data: Array<{ id: number; name: string; color: string }>;
  t: Record<string, string>;
}

export default function ProjectsSection({ data, t }: ProjectsSectionProps) {
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
        {t.projects || 'Projects'}
      </h3>

      <div className="space-y-3">
        {data.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-3 p-3 border border-foreground/30 hover:border-foreground/70 transition-all duration-300 cursor-pointer"
            style={{
              borderColor: project.color,
              backgroundColor: `${project.color}15`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 15px ${project.color}80`;
              e.currentTarget.style.backgroundColor = `${project.color}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.backgroundColor = `${project.color}15`;
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: project.color,
                boxShadow: `0 0 8px ${project.color}`,
              }}
            />
            <span className="font-semibold text-sm" style={{ color: project.color }}>
              ◆ {project.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
