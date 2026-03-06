import { useState } from 'react';
import Header from '@/components/Header';

const CYAN = '#00FFFF';
const GREEN = '#00FF00';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const RED = '#ef4444';
const BG = 'rgba(15, 21, 53, 0.5)';

function Card({ children, color = GREEN, title }: { children: React.ReactNode; color?: string; title: string }) {
  return (
    <div
      className="border p-6 backdrop-blur-sm mb-6"
      style={{
        borderColor: color,
        backgroundColor: BG,
        boxShadow: `0 0 20px ${color}22`,
      }}
    >
      <h3
        className="text-lg font-bold mb-4 tracking-widest uppercase flex items-center gap-2"
        style={{ color, textShadow: `0 0 10px ${color}` }}
      >
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

function RuleSection({ label, items, type }: { label: string; items: string[]; type: 'allow' | 'deny' | 'info' }) {
  const color = type === 'allow' ? GREEN : type === 'deny' ? RED : CYAN;
  const icon = type === 'allow' ? '✓' : type === 'deny' ? '✕' : 'ℹ';

  return (
    <div className="mb-4">
      <div className="text-xs font-mono font-bold mb-2 uppercase tracking-wider" style={{ color }}>
        {label}
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#ffffffcc' }}>
            <span className="mt-0.5 font-bold" style={{ color }}>{icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Rules() {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');

  const t: Record<string, string> = {
    live: language === 'ja' ? 'ライブ' : 'LIVE',
    status: language === 'ja' ? 'ステータス' : 'STATUS',
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header language={language} setLanguage={setLanguage} t={t} />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12 text-center">
          <h1
            className="text-3xl md:text-4xl font-bold tracking-widest mb-4"
            style={{ color: GREEN, textShadow: `0 0 20px ${GREEN}` }}
          >
            SYSTEM RULES
          </h1>
          <p className="text-sm font-mono" style={{ color: CYAN }}>
            各サイトの役割と運用に関する絶対遵守ルール
          </p>
        </div>

        <Card title="VCダッシュボード" color={GOLD}>
          <div className="text-xs font-mono mb-4" style={{ color: `${GOLD}aa` }}>
            URL: analytics.airdropsquest.com
          </div>
          <RuleSection label="用途" type="info" items={['VCに見せる']} />
          <RuleSection
            label="許可（ALLOWED）"
            type="allow"
            items={['アプリのデータのみ（ユーザー数・ポイント・国数・成長グラフ・アプリ関連KPI）']}
          />
          <RuleSection
            label="禁止（FORBIDDEN）"
            type="deny"
            items={['アプリのデータ以外のすべて（個人ウィジェット・チーム情報・ロードマップ・その他）']}
          />
        </Card>

        <Card title="チーム掲示板" color={PURPLE}>
          <div className="text-xs font-mono mb-4" style={{ color: `${PURPLE}aa` }}>
            URL: oshilabboard-8izsjxvg.manus.space
          </div>
          <RuleSection label="用途" type="info" items={['チーム内部用']} />
          <RuleSection
            label="許可（ALLOWED）"
            type="allow"
            items={['アカシックレコード', 'Links', 'タスク管理', 'ルール', '内部情報すべて']}
          />
        </Card>

        <Card title="Open Nation" color={CYAN}>
          <div className="text-xs font-mono mb-4" style={{ color: `${CYAN}aa` }}>
            URL: opennation.ai
          </div>
          <RuleSection label="用途" type="info" items={['一般公開']} />
          <RuleSection
            label="許可（ALLOWED）"
            type="allow"
            items={['HUMANS・AGENTS・NATIONS カウンターのみ']}
          />
          <RuleSection
            label="禁止（FORBIDDEN）"
            type="deny"
            items={['内部情報・個人情報・チーム情報']}
          />
        </Card>

        <Card title="OSHI変更ルール" color={GREEN}>
          <ul className="space-y-4">
            {[
              '変更前に必ず現在の状態をスクリーンショットで確認する',
              'VCダッシュボードへの追加前に「VCが見て意味があるか？」を確認する',
              '確認なしに「完了」と報告しない',
            ].map((rule, i) => (
              <li key={i} className="flex items-center gap-4 p-4 border" style={{ borderColor: `${GREEN}33`, backgroundColor: `${GREEN}08` }}>
                <span className="text-xl font-bold" style={{ color: GREEN }}>0{i + 1}</span>
                <span className="text-sm font-bold" style={{ color: '#ffffffcc' }}>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>
      </main>

      <footer className="border-t mt-16 py-8" style={{ borderColor: `${GREEN}22` }}>
        <div className="container mx-auto px-4 text-center text-xs font-mono" style={{ color: CYAN }}>
          <p>SYSTEM_RULES_v1.0 — Last updated: 2026-03-06</p>
        </div>
      </footer>
    </div>
  );
}
