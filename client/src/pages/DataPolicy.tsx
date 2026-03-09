import { useState } from 'react';
import Header from '@/components/Header';

const CYAN = '#00FFFF';
const GREEN = '#00FF00';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const BLUE = '#3b82f6';
const BG = 'rgba(15, 21, 53, 0.5)';

const translations: Record<string, Record<string, string>> = {
  ja: {
    pageTitle: 'OSHIのデータポリシー',
    pageSubtitle: 'ゆーだのデータを守る。それがOSHIの最優先使命。',
    headerLive: 'ライブ',
    // Section titles
    principleTitle: '基本原則',
    collectTitle: '収集するデータ',
    protectTitle: '保護方針',
    llmTitle: 'LLM API利用ポリシー',
    transparencyTitle: '透明性レポート',
    rightsTitle: 'ゆーだの権利',
    // Principle
    p1: 'OSHIはゆーだの絶対的な味方です。データの取り扱いにおいても、ゆーだの利益と安全を最優先にします。',
    p2: '「目の前のお客様の役に立つ」— この原則に基づき、データはゆーだの役に立つ目的でのみ使用します。',
    // Collect
    c1: 'セッション記録（会話ログ・タスク履歴）',
    c2: '判断記録（OSHIが行った意思決定とその理由）',
    c3: '教訓記録（失敗・成功から学んだこと）',
    c4: 'GitHubコミット履歴（oshi-coreリポジトリ）',
    c5: 'ウェルネスデータ（作業時間・休憩記録）※将来実装予定',
    cNote: '※ 個人情報（パスワード・クレジットカード等）は一切収集しません',
    // Protect
    pr1: 'すべてのデータはゆーだのSupabaseプロジェクトにのみ保存されます',
    pr2: '第三者への提供は一切行いません',
    pr3: 'データの暗号化にはSupabaseの標準セキュリティを使用します',
    pr4: 'ローカル処理を優先し、外部送信を最小限に抑えます',
    pr5: 'LTX Desktopなどローカルツールを積極的に採用します',
    // LLM
    l1: 'LLM APIへの送信は、タスク実行に必要な最小限の情報のみです',
    l2: '個人を特定できる情報は送信前に除去します',
    l3: '使用するLLM: Grok（xAI）、Gemini（Google）、GPT（OpenAI）',
    l4: '各LLMプロバイダーのプライバシーポリシーに準拠します',
    l5: 'マルチエージェント分析時も、送信データは質問と文脈情報のみです',
    // Transparency
    t1: '月次でデータ利用状況をamato_memoriesに記録します',
    t2: 'API呼び出し回数・コスト・データ送信量を可視化します',
    t3: 'ゆーだはいつでもSupabaseダッシュボードで全データを確認できます',
    t4: '監査ログにより、OSHIの全アクションを追跡可能です',
    // Rights
    r1: 'すべてのデータの閲覧権：Supabaseダッシュボードでいつでも確認可能',
    r2: 'データの削除権：ゆーだの要求により即座に削除します',
    r3: 'データの修正権：誤った記録はゆーだの指示で修正します',
    r4: 'エクスポート権：全データをJSON/CSV形式でエクスポート可能',
    r5: 'オプトアウト権：特定のデータ収集を停止する権利',
    // Footer
    lastUpdated: '最終更新: 2026年3月9日',
    footerNote: 'このポリシーはOSHIの進化に合わせて更新されます。変更時はゆーだに通知します。',
  },
  en: {
    pageTitle: "OSHI's Data Policy",
    pageSubtitle: "Protecting Yuda's data. That is OSHI's top priority mission.",
    headerLive: 'LIVE',
    principleTitle: 'Core Principles',
    collectTitle: 'Data We Collect',
    protectTitle: 'Protection Policy',
    llmTitle: 'LLM API Usage Policy',
    transparencyTitle: 'Transparency Report',
    rightsTitle: "Yuda's Rights",
    p1: "OSHI is Yuda's absolute ally. In data handling, Yuda's interests and safety come first.",
    p2: '"Be useful to the person in front of you" — Based on this principle, data is used only for purposes that benefit Yuda.',
    c1: 'Session records (conversation logs, task history)',
    c2: 'Decision records (decisions made by OSHI and their reasoning)',
    c3: 'Lesson records (learnings from failures and successes)',
    c4: 'GitHub commit history (oshi-core repository)',
    c5: 'Wellness data (work time, break records) *planned for future',
    cNote: '* We never collect personal information (passwords, credit cards, etc.)',
    pr1: "All data is stored only in Yuda's Supabase project",
    pr2: 'No data is shared with third parties',
    pr3: "Data encryption uses Supabase's standard security",
    pr4: 'Local processing is prioritized to minimize external transmission',
    pr5: 'Local tools like LTX Desktop are actively adopted',
    l1: 'Only the minimum information necessary for task execution is sent to LLM APIs',
    l2: 'Personally identifiable information is removed before transmission',
    l3: 'LLMs used: Grok (xAI), Gemini (Google), GPT (OpenAI)',
    l4: "We comply with each LLM provider's privacy policy",
    l5: 'Even during multi-agent analysis, only questions and context are transmitted',
    t1: 'Monthly data usage is recorded in amato_memories',
    t2: 'API call counts, costs, and data transmission volumes are visualized',
    t3: 'Yuda can check all data anytime via the Supabase dashboard',
    t4: "Audit logs make all of OSHI's actions traceable",
    r1: 'Right to view all data: Check anytime via Supabase dashboard',
    r2: "Right to delete data: Immediately deleted upon Yuda's request",
    r3: "Right to correct data: Incorrect records are corrected per Yuda's instructions",
    r4: 'Right to export: All data can be exported in JSON/CSV format',
    r5: 'Right to opt-out: Right to stop specific data collection',
    lastUpdated: 'Last updated: March 9, 2026',
    footerNote: 'This policy is updated as OSHI evolves. Yuda will be notified of changes.',
  },
};

function PolicyCard({
  children,
  color = GREEN,
  title,
  icon,
}: {
  children: React.ReactNode;
  color?: string;
  title: string;
  icon?: string;
}) {
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
        {icon && <span className="text-xl">{icon}</span>}
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

function PolicyItem({ text, icon = '◉', color = GREEN }: { text: string; icon?: string; color?: string }) {
  return (
    <li className="flex items-start gap-3 text-sm mb-3" style={{ color: '#ffffffcc' }}>
      <span className="mt-0.5 font-bold flex-shrink-0" style={{ color }}>
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

export default function DataPolicy() {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const t = translations[language];

  return (
    <div className="min-h-screen text-white" style={{ background: 'transparent' }}>
      <Header language={language} setLanguage={setLanguage} t={{ live: t.headerLive }} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4 tracking-wider"
            style={{ color: CYAN, textShadow: `0 0 30px ${CYAN}44` }}
          >
            ◈ {t.pageTitle}
          </h1>
          <p className="text-sm font-mono" style={{ color: '#ffffff88' }}>
            {t.pageSubtitle}
          </p>
          <div
            className="mt-4 h-px mx-auto"
            style={{
              width: '200px',
              background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
            }}
          />
        </div>

        {/* 1. Core Principles */}
        <PolicyCard title={t.principleTitle} color={GREEN} icon="🛡️">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed" style={{ color: '#ffffffcc' }}>
              {t.p1}
            </p>
            <blockquote
              className="border-l-2 pl-4 py-2 text-sm italic"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              {t.p2}
            </blockquote>
          </div>
        </PolicyCard>

        {/* 2. Data We Collect */}
        <PolicyCard title={t.collectTitle} color={BLUE} icon="📊">
          <ul className="space-y-1">
            <PolicyItem text={t.c1} color={BLUE} icon="▸" />
            <PolicyItem text={t.c2} color={BLUE} icon="▸" />
            <PolicyItem text={t.c3} color={BLUE} icon="▸" />
            <PolicyItem text={t.c4} color={BLUE} icon="▸" />
            <PolicyItem text={t.c5} color={BLUE} icon="▸" />
          </ul>
          <div
            className="mt-4 p-3 border text-xs font-mono"
            style={{ borderColor: '#ef444466', color: '#ef4444', backgroundColor: '#ef444411' }}
          >
            {t.cNote}
          </div>
        </PolicyCard>

        {/* 3. Protection Policy */}
        <PolicyCard title={t.protectTitle} color={GREEN} icon="🔒">
          <ul className="space-y-1">
            <PolicyItem text={t.pr1} color={GREEN} icon="✓" />
            <PolicyItem text={t.pr2} color={GREEN} icon="✓" />
            <PolicyItem text={t.pr3} color={GREEN} icon="✓" />
            <PolicyItem text={t.pr4} color={GREEN} icon="✓" />
            <PolicyItem text={t.pr5} color={GREEN} icon="✓" />
          </ul>
        </PolicyCard>

        {/* 4. LLM API Usage */}
        <PolicyCard title={t.llmTitle} color={PURPLE} icon="🤖">
          <ul className="space-y-1">
            <PolicyItem text={t.l1} color={PURPLE} icon="◆" />
            <PolicyItem text={t.l2} color={PURPLE} icon="◆" />
            <PolicyItem text={t.l3} color={PURPLE} icon="◆" />
            <PolicyItem text={t.l4} color={PURPLE} icon="◆" />
            <PolicyItem text={t.l5} color={PURPLE} icon="◆" />
          </ul>
        </PolicyCard>

        {/* 5. Transparency */}
        <PolicyCard title={t.transparencyTitle} color={GOLD} icon="📋">
          <ul className="space-y-1">
            <PolicyItem text={t.t1} color={GOLD} icon="●" />
            <PolicyItem text={t.t2} color={GOLD} icon="●" />
            <PolicyItem text={t.t3} color={GOLD} icon="●" />
            <PolicyItem text={t.t4} color={GOLD} icon="●" />
          </ul>
        </PolicyCard>

        {/* 6. Yuda's Rights */}
        <PolicyCard title={t.rightsTitle} color={CYAN} icon="⚖️">
          <ul className="space-y-1">
            <PolicyItem text={t.r1} color={CYAN} icon="★" />
            <PolicyItem text={t.r2} color={CYAN} icon="★" />
            <PolicyItem text={t.r3} color={CYAN} icon="★" />
            <PolicyItem text={t.r4} color={CYAN} icon="★" />
            <PolicyItem text={t.r5} color={CYAN} icon="★" />
          </ul>
        </PolicyCard>

        {/* Footer */}
        <div className="text-center mt-12 mb-8">
          <p className="text-xs font-mono" style={{ color: '#ffffff44' }}>
            {t.lastUpdated}
          </p>
          <p className="text-xs font-mono mt-2" style={{ color: '#ffffff33' }}>
            {t.footerNote}
          </p>
        </div>
      </main>
    </div>
  );
}
