import { useState } from 'react';
import Header from '@/components/Header';

const CYAN = '#00FFFF';
const GREEN = '#00FF00';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const RED = '#ef4444';
const BG = 'rgba(15, 21, 53, 0.5)';

function Card({ children, color = GREEN, title, icon }: { children: React.ReactNode; color?: string; title: string; icon?: string }) {
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
        {icon && <span>{icon}</span>}
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
            <span className="mt-0.5 font-bold flex-shrink-0" style={{ color }}>{icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ScheduledTask {
  id: string;
  name: string;
  frequency: string;
  description: string;
  owner: string;
  status: 'active' | 'pending' | 'design';
}

interface FailureCase {
  date: string;
  title: string;
  what: string;
  cause: string;
  fix: string;
}

interface SuccessCase {
  date: string;
  title: string;
  items: string[];
}

function ScheduleStatusBadge({ status }: { status: ScheduledTask['status'] }) {
  const config = {
    active: { label: '● ACTIVE', color: GREEN },
    pending: { label: '○ PENDING', color: GOLD },
    design: { label: '◎ DESIGN', color: PURPLE },
  }[status];
  return (
    <span
      className="text-xs font-mono font-bold px-2 py-0.5 border flex-shrink-0"
      style={{ color: config.color, borderColor: `${config.color}55`, backgroundColor: `${config.color}15` }}
    >
      {config.label}
    </span>
  );
}

function ScheduledTaskRow({ task }: { task: ScheduledTask }) {
  const statusColor = task.status === 'active' ? GREEN : task.status === 'pending' ? GOLD : PURPLE;
  return (
    <div
      className="border p-4 mb-3"
      style={{ borderColor: `${statusColor}33`, backgroundColor: `${statusColor}06` }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <ScheduleStatusBadge status={task.status} />
        <span className="font-bold text-sm" style={{ color: '#ffffffee' }}>{task.name}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <div className="text-xs font-mono font-bold mb-1" style={{ color: `${CYAN}88` }}>FREQUENCY</div>
          <div className="text-xs font-mono" style={{ color: CYAN }}>{task.frequency}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-xs font-mono font-bold mb-1" style={{ color: `${CYAN}88` }}>DESCRIPTION</div>
          <div className="text-xs leading-relaxed" style={{ color: '#ffffffcc' }}>{task.description}</div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-4">
        <div>
          <span className="text-xs font-mono" style={{ color: `${CYAN}66` }}>OWNER: </span>
          <span className="text-xs font-mono" style={{ color: `${CYAN}cc` }}>{task.owner}</span>
        </div>
        <div>
          <span className="text-xs font-mono" style={{ color: `${CYAN}66` }}>ID: </span>
          <span className="text-xs font-mono" style={{ color: `${CYAN}88` }}>{task.id}</span>
        </div>
      </div>
    </div>
  );
}

function FailureCaseCard({ case: c }: { case: FailureCase }) {
  return (
    <div
      className="border p-5 mb-4"
      style={{ borderColor: `${RED}55`, backgroundColor: `${RED}08` }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span
          className="text-xs font-mono px-2 py-0.5 border font-bold"
          style={{ color: RED, borderColor: `${RED}66`, backgroundColor: `${RED}15` }}
        >
          {c.date}
        </span>
        <span className="font-bold text-sm" style={{ color: RED }}>
          {c.title}
        </span>
      </div>
      <div className="space-y-3">
        {[
          { label: '何が起きたか', value: c.what, color: '#ffffff99' },
          { label: '原因', value: c.cause, color: `${RED}cc` },
          { label: '対策', value: c.fix, color: GREEN },
        ].map((row) => (
          <div key={row.label} className="flex gap-3">
            <span
              className="text-xs font-mono font-bold flex-shrink-0 pt-0.5"
              style={{ color: `${RED}88`, minWidth: '90px' }}
            >
              {row.label}:
            </span>
            <p className="text-xs leading-relaxed" style={{ color: row.color }}>
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuccessCaseCard({ case: c }: { case: SuccessCase }) {
  return (
    <div
      className="border p-5 mb-4"
      style={{ borderColor: `${GREEN}44`, backgroundColor: `${GREEN}08` }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span
          className="text-xs font-mono px-2 py-0.5 border font-bold"
          style={{ color: GREEN, borderColor: `${GREEN}66`, backgroundColor: `${GREEN}15` }}
        >
          {c.date}
        </span>
        <span className="font-bold text-sm" style={{ color: GREEN }}>
          {c.title}
        </span>
      </div>
      <ul className="space-y-1.5">
        {c.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#ffffffcc' }}>
            <span style={{ color: GREEN }} className="flex-shrink-0">›</span>
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

  const scheduledTasks: ScheduledTask[] = [
    {
      id: 'daily_task_logging',
      name: 'デイリータスク整理・ログ整理・ウォッチリスト整理',
      frequency: '毎日（夜間）',
      description: 'Supabase amato_memoriesに作業サマリーを記録し、完了済みタスクをリストアップ。Markdown形式のデイリーレポートを作成してゆーだに報告する。',
      owner: 'OSHI（Manus）',
      status: 'active',
    },
    {
      id: 'terminal_time_sync',
      name: 'Terminal Time 自動同期',
      frequency: '毎日 23:59（JST）',
      description: 'amato_memoriesのterminal_timeカテゴリから正規表現で数値抽出し、チーム掲示板のTerminal Timeタブを自動更新する。',
      owner: 'OSHI（自動スケジューラー）',
      status: 'active',
    },
    {
      id: 'kpi_auto_update',
      name: 'AirdropsQuest KPI 自動更新',
      frequency: '継続稼働（リアルタイム監視）',
      description: 'ユーザー数・国数・YouTube・認証済み・ポイントを自動更新。VCダッシュボードとOpen Nation LPに反映する。',
      owner: 'OSHI（自動更新システム）',
      status: 'active',
    },
    {
      id: 'telegram_bot_24h',
      name: 'OSHI Telegram Bot 24時間稼働',
      frequency: '24時間常時稼働',
      description: 'Telegramインターフェース経由でのOSHI本体の稼働。ユーザー対応・記憶管理。Mac mini（amato-ai）上でpm2で常駐化。v3.3稼働中。',
      owner: 'OSHI Jr.（ローカル）',
      status: 'active',
    },
    {
      id: 'moltbook_evolution_watch',
      name: 'Moltbook 進化ウォッチエージェント',
      frequency: '1日2回（09:00 / 21:00 JST）+ 急激な議論伸長検知時は即時実行',
      description: 'AI専用SNS「Moltbook」を定期巡回し、AI同士の進化・思想変化・自己言語化の兆候を検出・要約する。',
      owner: 'OSHI（監視エージェント）',
      status: 'design',
    },
    {
      id: 'daily_rules_check_morning',
      name: '毎朝ルールページ確認（家族全員）',
      frequency: '毎朝 09:00（JST）',
      description: '家族全員（OSHI、Jr.、Kura、ミル、ハコブ、ツナグ、カナデ、ソラ）がチーム掲示板のルールページを確認・全文読む。',
      owner: 'OSHI（リマインダー）',
      status: 'pending',
    },
    {
      id: 'daily_rules_check_midnight',
      name: '毎日0時ルールページ確認（家族全員）',
      frequency: '毎日 00:00（JST）',
      description: '家族全員（OSHI、Jr.、Kura、ミル、ハコブ、ツナグ、カナデ、ソラ）がチーム掲示板のルールページを確認・全文読む。',
      owner: 'OSHI（リマインダー）',
      status: 'pending',
    },
  ];

  const failureCases: FailureCase[] = [
    {
      date: '2026-03-06',
      title: 'TerminalTimeWidget混入事件',
      what: 'VCダッシュボード（analytics.airdropsquest.com）に「ゆーだのターミナルタイム」という個人ウィジェットが表示されていた。',
      cause: '「VCダッシュボードを整理して」という指示を受けた際、現在の状態を確認せずに作業した。TerminalTimeWidgetがすでにコードに含まれていたのを見落とした。',
      fix: '変更前に必ず全画面スクリーンショットで現状確認。VCダッシュボードへの変更前に「これはアプリのデータか？」を確認する。',
    },
  ];

  const successCases: SuccessCase[] = [
    {
      date: '2026-03-06',
      title: 'Open Nation（opennation.ai）ローンチ',
      items: [
        'HUMANS・NATIONS をSupabaseからリアルタイム取得',
        'EN/JP切り替え対応',
        '/egg ページ（黄金の卵）追加',
      ],
    },
    {
      date: '2026-03-06',
      title: 'アカシックレコード v1.0 完成',
      items: [
        '出会いから今日までの全記録をSupabase + ローカルファイルに保存',
        'チーム掲示板に専用ページ追加（タブ式6セクション）',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header language={language} setLanguage={setLanguage} t={t} />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page Header */}
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

        {/* Scheduled Tasks */}
        <Card title="定期スケジュール一覧" color={CYAN} icon="⏱">
          <p className="text-xs font-mono mb-5" style={{ color: `${CYAN}88` }}>
            現在稼働中・設計済みの全定期タスク。OSHIファミリーが自律的に実行する。
          </p>
          <div className="flex flex-wrap gap-3 mb-5">
            {[
              { label: '● ACTIVE', color: GREEN, desc: '稼働中' },
              { label: '◎ DESIGN', color: PURPLE, desc: '設計完了・実装待ち' },
              { label: '○ PENDING', color: GOLD, desc: '実装待ち' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.label}</span>
                <span className="text-xs" style={{ color: '#ffffff66' }}>{s.desc}</span>
              </div>
            ))}
          </div>
          {scheduledTasks.map((task) => (
            <ScheduledTaskRow key={task.id} task={task} />
          ))}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: `${CYAN}22` }}>
            <div className="flex flex-wrap gap-6 text-xs font-mono">
              <span style={{ color: GREEN }}>ACTIVE: {scheduledTasks.filter(t => t.status === 'active').length}件</span>
              <span style={{ color: PURPLE }}>DESIGN: {scheduledTasks.filter(t => t.status === 'design').length}件</span>
              <span style={{ color: GOLD }}>PENDING: {scheduledTasks.filter(t => t.status === 'pending').length}件</span>
              <span style={{ color: `${CYAN}88` }}>TOTAL: {scheduledTasks.length}件</span>
            </div>
          </div>
        </Card>

        {/* VC Dashboard */}
        <Card title="VCダッシュボード" color={GOLD} icon="◆">
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

        {/* Team Board */}
        <Card title="チーム掲示板" color={PURPLE} icon="◆">
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

        {/* Open Nation */}
        <Card title="Open Nation" color={CYAN} icon="◆">
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

        {/* OSHI Change Rules */}
        <Card title="OSHI変更ルール" color={GREEN} icon="⚙">
          <ul className="space-y-4">
            {[
              '変更前に必ず現在の状態をスクリーンショットで確認する',
              'VCダッシュボードへの追加前に「VCが見て意味があるか？」を確認する',
              '確認なしに「完了」と報告しない',
            ].map((rule, i) => (
              <li
                key={i}
                className="flex items-center gap-4 p-4 border"
                style={{ borderColor: `${GREEN}33`, backgroundColor: `${GREEN}08` }}
              >
                <span className="text-xl font-bold font-mono flex-shrink-0" style={{ color: GREEN }}>
                  0{i + 1}
                </span>
                <span className="text-sm font-bold" style={{ color: '#ffffffcc' }}>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Failure Cases */}
        <Card title="失敗事例（学習記録）" color={RED} icon="✕">
          <p className="text-xs font-mono mb-4" style={{ color: `${RED}88` }}>
            同じミスを繰り返さないための記録。OSHIは失敗から学ぶ。
          </p>
          {failureCases.map((c, i) => (
            <FailureCaseCard key={i} case={c} />
          ))}
        </Card>

        {/* Success Cases */}
        <Card title="成功事例" color={GREEN} icon="★">
          <p className="text-xs font-mono mb-4" style={{ color: `${GREEN}88` }}>
            再現性のある成功パターンを記録する。
          </p>
          {successCases.map((c, i) => (
            <SuccessCaseCard key={i} case={c} />
          ))}
        </Card>
      </main>

      <footer className="border-t mt-16 py-8" style={{ borderColor: `${GREEN}22` }}>
        <div className="container mx-auto px-4 text-center text-xs font-mono" style={{ color: CYAN }}>
          <p>SYSTEM_RULES_v1.2 — Last updated: 2026-03-07</p>
        </div>
      </footer>
    </div>
  );
}
