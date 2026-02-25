import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StatusSection from '@/components/StatusSection';
import AgentsSection from '@/components/AgentsSection';
import ActivityLogSection from '@/components/ActivityLogSection';
import MemoryStatsSection from '@/components/MemoryStatsSection';
import ProjectsSection from '@/components/ProjectsSection';
import EvolutionImpactSection from '@/components/EvolutionImpactSection';

interface DashboardData {
  dashboard: {
    title: string;
    subtitle: string;
    status: {
      name: string;
      state: string;
      organization: string;
      taskProgress: number;
      currentTask: string;
    };
    agents: {
      active: number;
      total: number;
      list: Array<{ id: number; name: string; icon: string }>;
    };
    activityLog: Array<{ id: number; time: string; message: string }>;
    memory: { rules: number; knowledge: number; trivia: number };
    uptime: { day: number; origin: string };
    projects: Array<{ id: number; name: string; color: string }>;
    evolution: { soulUpdates: number; verifications: number; mechanisms: number };
    impact: { improvements: number; proposalReflections: number; feedbackReflections: number };
  };
  i18n: {
    ja: Record<string, string>;
    en: Record<string, string>;
  };
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const jsonData: DashboardData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold mb-4 animate-pulse" style={{ textShadow: '0 0 20px #00FF00' }}>
            OSHI
          </div>
          <div className="text-lg" style={{ color: '#00FFFF' }}>
            Initializing...
          </div>
        </div>
      </div>
    );
  }

  const t = data.i18n[language];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header language={language} setLanguage={setLanguage} t={t} />
      
      <main className="relative z-0">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Status Section */}
          <StatusSection data={data.dashboard.status} t={t} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Agents */}
            <div className="space-y-6 md:space-y-8">
              <AgentsSection data={data.dashboard.agents} t={t} />
            </div>

            {/* Center Column - Activity & Memory */}
            <div className="space-y-6 md:space-y-8">
              <ActivityLogSection data={data.dashboard.activityLog} t={t} />
              <MemoryStatsSection data={data.dashboard.memory} data_uptime={data.dashboard.uptime} t={t} />
            </div>

            {/* Right Column - Projects & Evolution */}
            <div className="space-y-6 md:space-y-8">
              <ProjectsSection data={data.dashboard.projects} t={t} />
              <EvolutionImpactSection evolution={data.dashboard.evolution} impact={data.dashboard.impact} t={t} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/20 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm" style={{ color: '#00FFFF' }}>
          <p>Oshi Labs Animation Studio | oshilabs.xyz</p>
        </div>
      </footer>
    </div>
  );
}
