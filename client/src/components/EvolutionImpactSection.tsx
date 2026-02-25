interface EvolutionImpactSectionProps {
  evolution: { soulUpdates: number; verifications: number; mechanisms: number };
  impact: { improvements: number; proposalReflections: number; feedbackReflections: number };
  t: Record<string, string>;
}

export default function EvolutionImpactSection({ evolution, impact, t }: EvolutionImpactSectionProps) {
  return (
    <div className="space-y-6">
      {/* Evolution */}
      <div
        className="border border-foreground/50 p-6 backdrop-blur-sm"
        style={{
          borderColor: '#00FF00',
          backgroundColor: 'rgba(15, 21, 53, 0.5)',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)',
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
          {t.evolution || 'Evolution'}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: '#00FFFF' }}>
              {t.soulUpdates || 'Soul Updates'}
            </span>
            <span className="font-bold text-lg" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
              {evolution.soulUpdates}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: '#00FFFF' }}>
              {t.verifications || 'Verifications'}
            </span>
            <span className="font-bold text-lg" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
              {evolution.verifications}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: '#00FFFF' }}>
              {t.mechanisms || 'Mechanisms'}
            </span>
            <span className="font-bold text-lg" style={{ color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>
              {evolution.mechanisms}
            </span>
          </div>
        </div>
      </div>

      {/* Impact */}
      <div
        className="border border-foreground/50 p-6 backdrop-blur-sm"
        style={{
          borderColor: '#FF0000',
          backgroundColor: 'rgba(15, 21, 53, 0.5)',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.1)',
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: '#FF0000', textShadow: '0 0 10px #FF0000' }}>
          {t.impact || 'Impact'}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: '#00FFFF' }}>
              {t.improvements || 'Improvements'}
            </span>
            <span className="font-bold text-lg" style={{ color: '#FF0000', textShadow: '0 0 10px #FF0000' }}>
              {impact.improvements}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: '#00FFFF' }}>
              {t.proposalReflections || 'Proposal Reflections'}
            </span>
            <span className="font-bold text-lg" style={{ color: '#FF0000', textShadow: '0 0 10px #FF0000' }}>
              {impact.proposalReflections}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: '#00FFFF' }}>
              {t.feedbackReflections || 'Feedback Reflections'}
            </span>
            <span className="font-bold text-lg" style={{ color: '#FF0000', textShadow: '0 0 10px #FF0000' }}>
              {impact.feedbackReflections}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
