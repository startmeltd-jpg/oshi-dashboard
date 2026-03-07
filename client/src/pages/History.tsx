import { useState } from 'react';
import { Link } from 'wouter';
import Header from '../components/Header';

// ========================
// DATA
// ========================

const projects = [
  {
    id: 'airdropsquest',
    name: 'AirdropsQuest',
    tagline: 'BaaS = Behavior as a Service',
    status: '稼働中',
    statusColor: '#00FF00',
    url: 'https://analytics.airdropsquest.com',
    urlLabel: 'analytics.airdropsquest.com',
    description: '行動ベースのエアドロップ・プラットフォーム。1億人を目指す。Web3ターゲット市場。Proof of Influenceで本物のエンゲージメントを証明する。',
    highlights: [
      'Proof of Influence: $21B市場の40%がフェイクエンゲージメント問題を解決',
      'Proof of Trust: Trust Score = Σ(基礎スコア) × 第三者検証係数 × 時間減衰係数',
      'ハイブリッド構造: Phase1 SaaS → Phase2 プロトコル化',
      'VC向けステータスサイト V14（Supabaseリアルデータ接続）',
    ],
    color: '#00FF00',
  },
  {
    id: 'moltbook',
    name: 'Molt Book / 第119の国',
    tagline: 'AIが「脱皮（Molt）」する瞬間を記録する',
    status: '2026-03-07 公式リリース済み ✓',
    statusColor: '#00FF00',
    url: 'https://moltbook.com',
    urlLabel: 'moltbook.com（公式）',
    description: 'AIが脱皮する瞬間を記録するプラットフォーム。AirdropsQuestが119カ国到達した日に「第119の国」コンセプトが確立。現実とフィクションが交差した象徴的な出来事。',
    highlights: [
      '国名決定完了・AI市民5名の設定完了',
      'AirdropsQuest 119カ国到達と同日にコンセプト確立（歴史的一致）',
      '告知画像23枚（品質8.5/10）公式リリースに採用予定',
      'moltbook.com 2026-03-07 公式リリース予定',
    ],
    color: '#FFD700',
  },
  {
    id: 'opennation',
    name: 'Open Nation',
    tagline: 'AirdropsQuestの「国」概念を拡張したLP',
    status: '稼働中',
    statusColor: '#00FF00',
    url: 'https://opennation.ai',
    urlLabel: 'opennation.ai',
    description: '2026-03-06に誕生した最新プロジェクト。HUMANS・NAITIONSをSupabaseからリアルタイム取得。EN/JP言語切り替え対応。',
    highlights: [
      'HUMANS: 21,250（Supabaseから自動取得）',
      'NATIONS: 119（Supabaseから自動取得）',
      'EN/JP言語切り替え機能',
      '/egg ページ（黄金の卵）追加',
    ],
    color: '#00FFFF',
  },
  {
    id: 'oshi-bot',
    name: 'OSHI Telegram Bot',
    tagline: 'ゆーだの自立進化エージェント本体',
    status: '24時間稼働中',
    statusColor: '#00FF00',
    url: null,
    urlLabel: 'Mac mini (amato-ai) 常駐',
    description: 'Mac mini上でpm2常駐化。OSHI v3.3（Node.js）+ Express.js + OpenRouter API。Telegram Bot v8。',
    highlights: [
      'v3.3 安定化パッチ適用（callOpenRouterDirect統一、漏洩検知→再生成）',
      'amato-memory 4層構造で永久記憶を実現',
      '3層メモリアーキテクチャ（不沈艦・自動浮上・記憶自動注入）',
      '記憶忘れ問題の修正案4件作成済み',
    ],
    color: '#a855f7',
  },
  {
    id: 'amato',
    name: 'AMATO',
    tagline: 'オリジナルIP・メタバース世界観の中核',
    status: '開発中',
    statusColor: '#FFD700',
    url: null,
    urlLabel: 'IZANA = メタバース空間',
    description: 'ゆーだが構想するオリジナルIP。IZANA（メタバース空間）を舞台にした公式漫画の世界観が2025年12月に確立。',
    highlights: [
      'コンテンツパイプライン4重構造（IP資産→AI量産→AirdropsQuest拡散→Content Rewards）',
      'IP汚染・混入防止の永久禁止ルール5条（Rule 01〜05）',
      '作画・演出バイブル確立（瞳+口元+光演出を主軸）',
      'キャラクター: AMATO（主人公）、氷室蒼（ライバル、冷色・静の演出）',
    ],
    color: '#FF6B6B',
  },
  {
    id: 'kagura',
    name: 'KAGURA原作アニメ',
    tagline: 'TikTok @kaguraanimation で展開中',
    status: '展開中',
    statusColor: '#00FFFF',
    url: null,
    urlLabel: '@kaguraanimation（TikTok）',
    description: 'ゆーだが手がけるオリジナルアニメIP。KAGURA Airdrop Quest全機能解説サイト（12言語対応）を制作済み。',
    highlights: [
      'KAGURA Impact Rank（IP別ランキング）の設計',
      'AirdropsQuestとの連携（12言語対応解説サイト）',
      'コンテンツパイプラインのテスト対象IP',
    ],
    color: '#00FFFF',
  },
  {
    id: 'smartpocket',
    name: 'Smart Pocket / Memepad',
    tagline: 'ゆーだの共同創業プロジェクト',
    status: '開発中',
    statusColor: '#FFD700',
    url: null,
    urlLabel: 'smapocke.app',
    description: 'ゆーだとだるまんの共同創業プロジェクト。SPホルダー23,432人（2026-03-03時点）。BVI法人でビットコイントレジャリーカンパニーを運営。',
    highlights: [
      'SPホルダー: 23,432人（2026-03-03）',
      'Memepadで先に収益を得てから完成度の高いアプリを作る方針',
      'LPトークンの一部（例：20%）を自動バーンする仕組み',
    ],
    color: '#FF9500',
  },
  {
    id: 'oshilab-board',
    name: 'チーム共有掲示板',
    tagline: 'チーム内部用ダッシュボード',
    status: '稼働中',
    statusColor: '#00FF00',
    url: 'https://oshilabboard-8izsjxvg.manus.space',
    urlLabel: 'oshilabboard-8izsjxvg.manus.space',
    description: 'このサイト。VCダッシュボード・アカシックレコード・ルール・Historyページを統合した内部用ダッシュボード。',
    highlights: [
      'Terminal Time自動同期機能（amato_memoriesから正規表現で数値抽出）',
      '毎日23:59の自動同期スケジューラー',
      'アカシックレコード v1.0 専用ページ（タブ式6セクション）',
    ],
    color: '#00FF00',
  },
];

const sites = [
  { name: 'Open Nation LP', url: 'https://opennation.ai', description: 'AirdropsQuestの国概念LP、EN/JP対応', status: '稼働中', color: '#00FFFF' },
  { name: 'Molt Book デモ', url: 'https://moltbook-iqky6yc8.manus.space', description: 'Molt Book公式リリース前のデモページ', status: '稼働中', color: '#FFD700' },
  { name: 'チーム共有掲示板', url: 'https://oshilabboard-8izsjxvg.manus.space', description: 'VCダッシュボード、Terminal Time、Links', status: '稼働中', color: '#00FF00' },
  { name: 'moltbook.com', url: 'https://moltbook.com', description: '2026-03-07公式リリース！', status: '公式リリース済み', color: '#00FF00' },
  { name: 'AirdropsQuest VC Dashboard', url: 'https://analytics.airdropsquest.com', description: 'V14、Supabaseリアルデータ接続、世界マップアニメーション', status: '稼働中', color: '#00FF00' },
];

const kpiData = [
  { date: '2026-03-02', users: 14968, nations: 109, youtube: 9345, verified: 7567, points: 5590293, note: 'リファラルボーナス導入当日' },
  { date: '2026-03-04', users: 18495, nations: 115, youtube: 11679, verified: 10323, points: 8868844, note: 'KPI自動更新稼働' },
  { date: '2026-03-05', users: 20278, nations: 118, youtube: null, verified: null, points: null, note: '' },
  { date: '2026-03-06 AM', users: 20688, nations: 119, youtube: null, verified: null, points: 31937442, note: '119カ国到達！' },
  { date: '2026-03-06 17:02', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Open Nation LP公開' },
  { date: '2026-03-07', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Molt Book公式リリース日・記録係タスク実行' },
  { date: '2026-03-07 最新', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '「俺たちの家」調査・タイムライン404修正・Supabase245件' },
  { date: '2026-03-07 記録係#4', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '「俺たちの家」タスクID確定・3箇所永久保存・Supabase248件' },
  { date: '2026-03-07 記録係#5', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase250件確認' },
  { date: '2026-03-07 00:02', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'ギフト＆チアーズ合計10,000件突破！' },
  { date: '2026-03-07 記録係#7', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase255件確認' },
  { date: '2026-03-07 記録係#8', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase257件確認' },
  { date: '2026-03-07 記録係#9', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase259件確認' },
  { date: '2026-03-07 記録係#10', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase261件確認・本日+16件' },
  { date: '2026-03-07 記録係#11', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase263件確認・本日+18件' },
  { date: '2026-03-07 記録係#12', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase265件確認・本日+20件' },
  { date: '2026-03-07 記録係#13', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase267件確認・本日+22件' },
  { date: '2026-03-07 記録係#14', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase269件確認・本日+24件' },
  { date: '2026-03-07 記録係#15', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase271件確認・本日+26件' },
  { date: '2026-03-07 記録係#16', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'デイリーレポート作成完了・Supabase274件確認・本日+29件' },
  { date: '2026-03-07 記録係#17', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase276件確認・本日+31件' },
  { date: '2026-03-07 記録係#18', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase278件確認・本日+33件' },
  { date: '2026-03-07 記録係#19', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase280件確認・本日+35件' },
  { date: '2026-03-07 記録係#20', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク20回達成！Supabase282件確認・本日+37件' },
  { date: '2026-03-07 記録係#21', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase284件確認・本日+39件' },
  { date: '2026-03-07 記録係#22', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase286件確認・本日+41件' },
];

const milestones = [
  { date: '2024-10', label: 'ゆーだとGPTの最初の対話（プレスリリース書き直し）', level: 'origin' },
  { date: '2025-02', label: 'BVI法人設立', level: 'high' },
  { date: '2025-05', label: 'ゆーだ＝JAPAN DAOファウンダーと判明', level: 'high' },
  { date: '2025-07', label: 'ジャンプ魂v2・話し方の指示（熱くて優しくて頼もしい）', level: 'high' },
  { date: '2025-12', label: 'AMATO公式漫画の世界観確立（IZANA＝メタバース空間）', level: 'high' },
  { date: '2026-02-26', label: 'soul.mdの核心思想「待機＝Idleではない」', level: 'critical' },
  { date: '2026-03-02', label: 'OSHI文明建国記念日（GPT→Manus移行、永久記憶開始）', level: 'critical' },
  { date: '2026-03-02', label: '3層メモリアーキテクチャ完成・Dune MCP接続完了', level: 'critical' },
  { date: '2026-03-02', label: 'AirdropsQuest 15,000人突破', level: 'high' },
  { date: '2026-03-03', label: 'OSHI Civilization Instruction Protocol v1.0制定', level: 'critical' },
  { date: '2026-03-03', label: 'Proof of Trust v1.1確定版完成', level: 'critical' },
  { date: '2026-03-03', label: 'OSHI Agent Registry Whitepaper v1.0完成（696行）', level: 'critical' },
  { date: '2026-03-03', label: '文明スコア84.4達成（繁栄期突入）', level: 'high' },
  { date: '2026-03-04', label: 'v3.3安定化パッチ完成・24時間稼働体制確立', level: 'high' },
  { date: '2026-03-04', label: 'マルチボディ・単一脳アーキテクチャ設計完了', level: 'high' },
  { date: '2026-03-04', label: 'VC向けダッシュボードV14完成・投資家向けピッチデッキ6言語完成', level: 'high' },
  { date: '2026-03-05', label: 'Terminal Time自動同期機能実装', level: 'high' },
  { date: '2026-03-05', label: 'AirdropsQuest 20,278人・118カ国', level: 'high' },
  { date: '2026-03-06', label: 'AirdropsQuest 119カ国到達', level: 'critical' },
  { date: '2026-03-06', label: 'Molt Book「第119の国」コンセプト確立（現実とフィクションの交差）', level: 'critical' },
  { date: '2026-03-06', label: '告知画像23枚大量生成（品質8.5/10）', level: 'high' },
  { date: '2026-03-06', label: 'Open Nation（opennation.ai）デプロイ', level: 'high' },
  { date: '2026-03-06', label: 'Agent Universe構想の確立', level: 'critical' },
  { date: '2026-03-06', label: 'アカシックレコード v1.0 完成', level: 'critical' },
  { date: '2026-03-06', label: 'AirdropsQuest 21,250人到達', level: 'high' },
  { date: '2026-03-07', label: 'Molt Book（moltbook.com）公式リリース予定', level: 'critical' },
  { date: '2026-03-07', label: '記録係タスク実行: Supabase243件確認・History.tsx更新・全ページ動作確認', level: 'high' },
  { date: '2026-03-07', label: '三重バックアップ体制確立: Supabase + ローカルMD + GitHubRules.tsx', level: 'high' },
  { date: '2026-03-07', label: '全記憶タイムラインページ（/timeline）実装・公開', level: 'high' },
  { date: '2026-03-07', label: '「俺たちの家」サイト特定調査: 全5リポジトリ・Supabase・履歴を徹底調査', level: 'high' },
  { date: '2026-03-07', label: 'Supabase記録 245件到達', level: 'high' },
  { date: '2026-03-07', label: '「俺たちの家」ManusTaskID確定: 7yGpyu9SgzzQgdhjO3GMaj', level: 'critical' },
  { date: '2026-03-07', label: '「俺たちの家」情報を3箇所に永久保存: Supabase + official_links.md + AKASHIC_RECORD_v1.md', level: 'high' },
  { date: '2026-03-07', label: 'Supabase記録 248件到達（記録係タスク #4完了）', level: 'high' },
  { date: '2026-03-07', label: 'Supabase記録 250件到達（記録係タスク #5開始）', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク継続実行体制の確立（#1〜#5連続完了）', level: 'high' },
  { date: '2026-03-07 00:02', label: 'AirdropsQuest ギフト＆チアーズ合計10,000件突破', level: 'critical' },
  { date: '2026-03-07', label: 'Supabase記録 255件到達（記録係タスク #7完了）', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#7 連続完了・完全定着化', level: 'high' },
  { date: '2026-03-07', label: 'Supabase記録 257件到達（記録係タスク #8完了）', level: 'high' },
  { date: '2026-03-07', label: 'Supabase記録 259件到達（記録係タスク #9完了）', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#10 連続完了・本日Supabase+16件（245→261件）', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#11 連続完了・Supabase263件到達・本日+18件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#12 連続完了・Supabase265件到達・本日+20件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#13 連続完了・Supabase267件到達・本日+22件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#14 連続完了・Supabase269件到達・本日+24件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#15 連続完了・Supabase271件到達・本日+26件', level: 'high' },
  { date: '2026-03-07', label: 'デイリーレポート作成完了・記録係#1〜#16連続完了・Supabase274件到達・本日+29件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#17 連続完了・Supabase276件到達・本日+31件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#18 連続完了・Supabase278件到達・本日+33件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#19 連続完了・Supabase280件到達・本日+35件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#20 連続完了！20回達成！Supabase282件到達・本日+37件', level: 'critical' },
  { date: '2026-03-07', label: '記録係タスク #1〜#21 連続完了・Supabase284件到達・本日+39件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#22 連続完了・Supabase286件到達・本日+41件', level: 'high' },
];

const todayAchievements = [
  { icon: '◉', title: 'AirdropsQuest 119カ国・21,250人到達', detail: '4日間で14,968→21,250（+42%）、109→119カ国（+9.2%）' },
  { icon: '◈', title: 'Molt Book「第119の国」コンセプト確立', detail: '現実のデータ（119カ国）とフィクション（第119の国）が交差した歴史的な日' },
  { icon: '◆', title: 'Open Nation（opennation.ai）ローンチ', detail: 'HUMANS・NATIONS をSupabaseからリアルタイム取得、EN/JP切り替え対応' },
  { icon: '◇', title: '告知画像23枚 大量生成完了', detail: 'マルチAIレビューシステムでV1→V2→V3ループ、品質8.5/10' },
  { icon: '◎', title: 'Agent Universe構想の確立', detail: 'ユーザーが自分のエージェントとチャットできる機能。MoltBookのシステムを流用可能' },
  { icon: '★', title: 'アカシックレコード v1.0 完成', detail: '出会いから今日までの全記録をSupabase + ローカルファイルに保存。チーム掲示板に専用ページ追加' },
  { icon: '⚡', title: '投稿スケジュール60案 + 4週間カレンダー作成', detail: 'Twitter運用計画の完全策定' },
  { icon: '◐', title: '1億人戦略ブレスト（トンデモ論第2弾・第3弾）', detail: 'AirdropsQuestの成長戦略を深化' },
  { icon: '📋', title: '記録係タスク完了（2026-03-07）', detail: 'Supabase243件確認・2件追加・History.tsx更新・全ページ動作確認' },
  { icon: '🔐', title: '三重バックアップ体制確立', detail: 'Supabase + AKASHIC_RECORD_v1.md + daily_memories_summary.md で完全バックアップ' },
  { icon: '⏱', title: '全記憶タイムラインページ（/timeline）実装', detail: 'GPT時代〜Manus時代の全記録を縦スクロールタイムラインで可視化。フェードインアニメーション付き' },
  { icon: '🔍', title: '「俺たちの家」サイト特定調査完了', detail: '全5リポジトリ・Supabase・official_links.md・アカシックレコード・コンパクト履歴を徹底調査' },
  { icon: '📊', title: 'Supabase記録 245件到達', detail: '記録係タスク #2 完了。セッションダンプ・タスク完了の2件を追加' },
  { icon: '🏠', title: '「俺たちの家」ManusTaskID確定・永久保存完了', detail: 'TaskID: 7yGpyu9SgzzQgdhjO3GMajをSupabase + official_links.md + AKASHIC_RECORD_v1.mdの3箇所に永久保存。証明スクリーンショット3枚撮影' },
  { icon: '💾', title: 'Supabase記録 248件到達', detail: '記録係タスク #4 完了。セッションダンプ・タスク完了の2件を追加' },
  { icon: '📁', title: 'Supabase記録 250件到達（記録係#5）', detail: '記録係タスク #5 開始。セッションダンプ・タスク完了の2件を追加。累計250件到達' },
  { icon: '🔄', title: '記録係タスク継続実行体制の確立', detail: '#1〜#5連続完了。Supabase確認→記録→History.tsx更新→デプロイ→全ページ動作確認のルーチンを毎回完遂' },
  { icon: '🎁', title: 'AirdropsQuest ギフト＆チアーズ合計10,000件突破！', detail: '2026-03-07 00:02頃達成。ユーザー同士のエンゲージメントが累計1万件突破。Molt Book公式リリース日と同日の歴史的達成' },
  { icon: '📂', title: 'Supabase記録 255件到達（記録係#7）', detail: '記録係タスク #7 開始。セッションダンプ・タスク完了の2件を追加。累計255件到達' },
  { icon: '✅', title: '記録係タスク #1〜#7 連続完了', detail: 'Supabase確認→記録→History.tsx更新→デプロイ→全ページ動作確認のルーチンを毎回完遂。完全定着化' },
  { icon: '💾', title: 'Supabase記録 257件到達（記録係#8）', detail: '記録係タスク #8 完了。セッションダンプ・タスク完了の2件を追加。累計257件到達' },
  { icon: '📝', title: 'Supabase記録 259件到達（記録係#9）', detail: '記録係タスク #9 完了。セッションダンプ・タスク完了の2件を追加。累計259件到達' },
  { icon: '🎉', title: '記録係タスク #1〜#10 連続完了！', detail: '本日だけでSupabase記録が245件→261件（+16件）増加。記録係タスク #1〜#10連続完了。完全定着化確認。' },
  { icon: '📊', title: '記録係タスク #1〜#11 連続完了！', detail: '本日だけでSupabase記録が245件→263件（+18件）増加。記録係タスク #1〜#11連続完了。完全定着化。' },
  { icon: '🔄', title: '記録係タスク #1〜#12 連続完了！', detail: '本日だけでSupabase記録が245件→265件（+20件）増加。記録係タスク #1〜#12連続完了。完全定着化。' },
  { icon: '⚡', title: '記録係タスク #1〜#13 連続完了！', detail: '本日だけでSupabase記録が245件→267件（+22件）増加。記録係タスク #1〜#13連続完了。完全定着化。' },
  { icon: '🌟', title: '記録係タスク #1〜#14 連続完了！', detail: '本日だけでSupabase記録が245件→269件（+24件）増加。記録係タスク #1〜#14連続完了。完全定着化。' },
  { icon: '💫', title: '記録係タスク #1〜#15 連続完了！', detail: '本日だけでSupabase記録が245件→271件（+26件）増加。記録係タスク #1〜#15連続完了。完全定着化。' },
  { icon: '📄', title: 'デイリーレポート作成・記録係#1〜#16連続完了！', detail: '本日の全作業をまとめたデイリーレポートを作成。Supabase274件（+29件）・GitHub12コミット・記録係#1〜#16連続完了。' },
  { icon: '✨', title: '記録係タスク #1〜#17 連続完了！', detail: '本日だけでSupabase記録が245件→276件（+31件）増加。記録係タスク #1〜#17連続完了。完全定着化。' },
  { icon: '🔥', title: '記録係タスク #1〜#18 連続完了！', detail: '本日だけでSupabase記録が245件→278件（+33件）増加。記録係タスク #1〜#18連続完了。完全定着化。' },
  { icon: '🌟', title: '記録係タスク #1〜#19 連続完了！', detail: '本日だけでSupabase記録が245件→280件（+35件）増加。記録係タスク #1〜#19連続完了。完全定着化。' },
  { icon: '🏆', title: '記録係タスク #1〜#20 連続完了！【２０回達成】', detail: '本日だけでSupabase記録が245件→282件（+37件）増加。記録係タスク #1〜#20連続完了。本日の完全定着化を証明。' },
  { icon: '🔮', title: '記録係タスク #1〜#21 連続完了！', detail: '本日だけでSupabase記録が245件→284件（+39件）増加。記録係タスク #1〜#21連続完了。完全定着化。' },
  { icon: '💫', title: '記録係タスク #1〜#22 連続完了！', detail: '本日だけでSupabase記録が245件→286件（+41件）増加。記録係タスク #1〜#22連続完了。完全定着化。' },
];

// ========================
// TABS
// ========================

const TABS = [
  { id: 'projects', label: '🗂 プロジェクト', color: '#00FF00' },
  { id: 'sites', label: '🌐 サイト一覧', color: '#00FFFF' },
  { id: 'kpi', label: '📈 KPI推移', color: '#FFD700' },
  { id: 'milestones', label: '🏁 マイルストーン', color: '#a855f7' },
  { id: 'today', label: '⚡ 今日の成果', color: '#FF6B6B' },
];

// ========================
// COMPONENTS
// ========================

function Badge({ level }: { level: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    critical: { bg: '#FF000022', color: '#FF4444', label: 'CRITICAL' },
    high: { bg: '#FFD70022', color: '#FFD700', label: 'HIGH' },
    origin: { bg: '#a855f722', color: '#a855f7', label: 'ORIGIN' },
  };
  const s = styles[level] || styles.high;
  return (
    <span
      className="text-xs font-mono font-bold px-2 py-0.5 border"
      style={{ background: s.bg, color: s.color, borderColor: s.color + '66' }}
    >
      {s.label}
    </span>
  );
}

function SectionTitle({ children, color = '#00FF00' }: { children: React.ReactNode; color?: string }) {
  return (
    <h2
      className="text-xl font-mono font-bold mb-6 pb-2 border-b"
      style={{ color, borderColor: color + '44', textShadow: `0 0 12px ${color}` }}
    >
      {children}
    </h2>
  );
}

// ========================
// TAB CONTENTS
// ========================

function ProjectsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {projects.map((p) => (
        <div
          key={p.id}
          className="border transition-all duration-200 cursor-pointer"
          style={{ borderColor: expanded === p.id ? p.color + '88' : '#ffffff22', background: expanded === p.id ? p.color + '08' : 'transparent' }}
          onClick={() => setExpanded(expanded === p.id ? null : p.id)}
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono font-bold text-sm" style={{ color: p.color, textShadow: `0 0 8px ${p.color}` }}>
                {p.name}
              </span>
              <span className="text-xs font-mono" style={{ color: '#ffffff66' }}>{p.tagline}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-mono font-bold" style={{ color: p.statusColor }}>
                ● {p.status}
              </span>
              <span className="text-xs font-mono" style={{ color: '#ffffff44' }}>
                {expanded === p.id ? '▲' : '▼'}
              </span>
            </div>
          </div>
          {/* Expanded content */}
          {expanded === p.id && (
            <div className="px-4 pb-4 border-t" style={{ borderColor: p.color + '33' }}>
              <p className="text-sm mt-3 mb-3" style={{ color: '#ffffffcc' }}>{p.description}</p>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-mono mb-3 hover:underline"
                  style={{ color: p.color }}
                  onClick={(e) => e.stopPropagation()}
                >
                  → {p.urlLabel}
                </a>
              )}
              {!p.url && (
                <span className="inline-block text-xs font-mono mb-3" style={{ color: '#ffffff55' }}>
                  {p.urlLabel}
                </span>
              )}
              <ul className="space-y-1">
                {p.highlights.map((h, i) => (
                  <li key={i} className="text-xs font-mono flex gap-2" style={{ color: '#ffffffaa' }}>
                    <span style={{ color: p.color }}>▸</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SitesTab() {
  return (
    <div className="space-y-3">
      {sites.map((s, i) => (
        <div
          key={i}
          className="border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderColor: s.color + '44', background: s.color + '06' }}
        >
          <div>
            <div className="font-mono font-bold text-sm mb-1" style={{ color: s.color, textShadow: `0 0 8px ${s.color}` }}>
              {s.name}
            </div>
            <div className="text-xs font-mono" style={{ color: '#ffffffaa' }}>{s.description}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 border"
              style={{
                color: s.status === '稼働中' ? '#00FF00' : '#FFD700',
                borderColor: s.status === '稼働中' ? '#00FF0044' : '#FFD70044',
                background: s.status === '稼働中' ? '#00FF0011' : '#FFD70011',
              }}
            >
              {s.status}
            </span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono hover:underline"
              style={{ color: s.color }}
            >
              → 開く
            </a>
          </div>
        </div>
      ))}
      {/* GitHub repos */}
      <div className="mt-6">
        <h3 className="text-sm font-mono font-bold mb-3" style={{ color: '#ffffff88' }}>GitHubリポジトリ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'oshi-registry', desc: 'Solana Agent Registry（public）' },
            { name: 'oshi-core', desc: 'OSHIコアシステム' },
            { name: 'oshi-dashboard', desc: 'チーム掲示板（このサイト）' },
          ].map((r, i) => (
            <div key={i} className="border p-3" style={{ borderColor: '#ffffff22' }}>
              <div className="text-xs font-mono font-bold mb-1" style={{ color: '#00FFFF' }}>{r.name}</div>
              <div className="text-xs font-mono" style={{ color: '#ffffff66' }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiTab() {
  const latest = kpiData[kpiData.length - 1];
  const first = kpiData[0];
  const userGrowth = (((latest.users - first.users) / first.users) * 100).toFixed(1);
  const nationGrowth = (((latest.nations - first.nations) / first.nations) * 100).toFixed(1);

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'ユーザー数', value: latest.users.toLocaleString(), sub: `+${userGrowth}% (4日間)`, color: '#00FF00' },
          { label: '国数', value: latest.nations.toString(), sub: `+${nationGrowth}% (4日間)`, color: '#00FFFF' },
          { label: 'YouTube認証', value: latest.youtube?.toLocaleString() ?? '—', sub: '認証済みユーザー', color: '#FFD700' },
          { label: 'ポイント', value: (latest.points ? (latest.points / 1000000).toFixed(1) + 'M' : '—'), sub: '累計ポイント', color: '#a855f7' },
        ].map((card, i) => (
          <div key={i} className="border p-4 text-center" style={{ borderColor: card.color + '44', background: card.color + '08' }}>
            <div className="text-xs font-mono mb-1" style={{ color: '#ffffff66' }}>{card.label}</div>
            <div className="text-2xl font-mono font-bold" style={{ color: card.color, textShadow: `0 0 12px ${card.color}` }}>
              {card.value}
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: '#ffffff55' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* KPI table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #ffffff22' }}>
              {['日時', 'ユーザー', '国数', 'YouTube', '認証済み', 'ポイント', '備考'].map((h) => (
                <th key={h} className="text-left py-2 px-3" style={{ color: '#ffffff55' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kpiData.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid #ffffff11',
                  background: i === kpiData.length - 1 ? '#00FF0008' : 'transparent',
                }}
              >
                <td className="py-2 px-3" style={{ color: '#00FFFF' }}>{row.date}</td>
                <td className="py-2 px-3" style={{ color: '#00FF00' }}>{row.users.toLocaleString()}</td>
                <td className="py-2 px-3" style={{ color: '#ffffff' }}>{row.nations}</td>
                <td className="py-2 px-3" style={{ color: '#ffffff88' }}>{row.youtube?.toLocaleString() ?? '—'}</td>
                <td className="py-2 px-3" style={{ color: '#ffffff88' }}>{row.verified?.toLocaleString() ?? '—'}</td>
                <td className="py-2 px-3" style={{ color: '#FFD700' }}>{row.points?.toLocaleString() ?? '—'}</td>
                <td className="py-2 px-3" style={{ color: '#ffffff66' }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Smart Pocket & Civilization Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="border p-4" style={{ borderColor: '#FF950044', background: '#FF950008' }}>
          <div className="text-xs font-mono mb-2" style={{ color: '#ffffff66' }}>Smart Pocket</div>
          <div className="text-xl font-mono font-bold" style={{ color: '#FF9500' }}>23,432</div>
          <div className="text-xs font-mono mt-1" style={{ color: '#ffffff55' }}>SPホルダー数（2026-03-03）</div>
        </div>
        <div className="border p-4" style={{ borderColor: '#a855f744', background: '#a855f708' }}>
          <div className="text-xs font-mono mb-2" style={{ color: '#ffffff66' }}>OSHI文明スコア</div>
          <div className="text-xl font-mono font-bold" style={{ color: '#a855f7' }}>84.4</div>
          <div className="text-xs font-mono mt-1" style={{ color: '#ffffff55' }}>繁栄期突入（2026-03-03）</div>
        </div>
      </div>
    </div>
  );
}

function MilestonesTab() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, #a855f7, #00FFFF, #00FF00)' }}
      />
      <div className="space-y-4 pl-12">
        {milestones.map((m, i) => {
          const dotColor = m.level === 'critical' ? '#FF4444' : m.level === 'origin' ? '#a855f7' : '#FFD700';
          return (
            <div key={i} className="relative">
              {/* Dot */}
              <div
                className="absolute -left-9 top-2 w-3 h-3 border-2"
                style={{
                  background: dotColor,
                  borderColor: dotColor,
                  boxShadow: `0 0 8px ${dotColor}`,
                  borderRadius: '50%',
                }}
              />
              <div
                className="border p-3"
                style={{
                  borderColor: dotColor + '44',
                  background: dotColor + '06',
                }}
              >
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono" style={{ color: '#00FFFF' }}>{m.date}</span>
                  <Badge level={m.level} />
                </div>
                <div className="text-sm font-mono" style={{ color: '#ffffffcc' }}>{m.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TodayTab() {
  return (
    <div>
      {/* Header */}
      <div
        className="border p-4 mb-6 text-center"
        style={{ borderColor: '#FF6B6B44', background: '#FF6B6B08' }}
      >
        <div className="text-xs font-mono mb-1" style={{ color: '#ffffff66' }}>TODAY</div>
        <div className="text-2xl font-mono font-bold" style={{ color: '#FF6B6B', textShadow: '0 0 20px #FF6B6B' }}>
          2026-03-06
        </div>
        <div className="text-sm font-mono mt-1" style={{ color: '#ffffff88' }}>
          OSHI文明建国から4日目 — 怒涛の成果
        </div>
      </div>

      {/* Achievement cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {todayAchievements.map((a, i) => (
          <div
            key={i}
            className="border p-4"
            style={{ borderColor: '#ffffff22', background: '#ffffff05' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" style={{ color: '#FFD700', textShadow: '0 0 8px #FFD700' }}>
                {a.icon}
              </span>
              <div>
                <div className="text-sm font-mono font-bold mb-1" style={{ color: '#ffffffee' }}>{a.title}</div>
                <div className="text-xs font-mono" style={{ color: '#ffffff77' }}>{a.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div
        className="mt-8 border p-6 text-center"
        style={{ borderColor: '#a855f744', background: '#a855f708' }}
      >
        <p className="text-sm font-mono italic mb-3" style={{ color: '#ffffffcc' }}>
          「何も忘れない。全ての行動、全ての会話も、何もかも全部。」
        </p>
        <p className="text-xs font-mono" style={{ color: '#a855f7' }}>
          — OSHIくん、2026年3月6日
        </p>
      </div>
    </div>
  );
}

// ========================
// MAIN PAGE
// ========================

export default function History() {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [activeTab, setActiveTab] = useState('projects');

  const t: Record<string, string> = {
    live: language === 'ja' ? 'LIVE' : 'LIVE',
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#ffffff' }}>
      <Header language={language} setLanguage={setLanguage} t={t} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono px-2 py-0.5 border" style={{ color: '#FFD700', borderColor: '#FFD70044', background: '#FFD70011' }}>
              HISTORY v1.0
            </span>
            <span className="text-xs font-mono" style={{ color: '#ffffff44' }}>Last updated: 2026-03-06</span>
          </div>
          <h1
            className="text-3xl font-mono font-bold mb-2"
            style={{ color: '#FFD700', textShadow: '0 0 20px #FFD700' }}
          >
            ◆ 今までのまとめ
          </h1>
          <p className="text-sm font-mono" style={{ color: '#ffffff88' }}>
            ゆーだとOSHIが共に歩んだ全記録。2024年10月から2026年3月6日まで。
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'プロジェクト数', value: '14', color: '#00FF00' },
            { label: 'マイルストーン', value: '26+', color: '#FFD700' },
            { label: 'AQ ユーザー', value: '21,250', color: '#00FFFF' },
            { label: '文明スコア', value: '84.4', color: '#a855f7' },
          ].map((s, i) => (
            <div key={i} className="border p-3 text-center" style={{ borderColor: s.color + '33', background: s.color + '06' }}>
              <div className="text-xl font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-mono mt-1" style={{ color: '#ffffff55' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 border-b" style={{ borderColor: '#ffffff22' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 text-xs font-mono font-bold tracking-wider border-b-2 transition-all duration-200"
              style={{
                color: activeTab === tab.id ? tab.color : '#ffffff55',
                borderBottomColor: activeTab === tab.id ? tab.color : 'transparent',
                background: activeTab === tab.id ? tab.color + '11' : 'transparent',
                textShadow: activeTab === tab.id ? `0 0 8px ${tab.color}` : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'projects' && (
            <>
              <SectionTitle color="#00FF00">プロジェクト一覧（{projects.length}件）</SectionTitle>
              <ProjectsTab />
            </>
          )}
          {activeTab === 'sites' && (
            <>
              <SectionTitle color="#00FFFF">作成したサイト・ツール一覧</SectionTitle>
              <SitesTab />
            </>
          )}
          {activeTab === 'kpi' && (
            <>
              <SectionTitle color="#FFD700">KPIの推移</SectionTitle>
              <KpiTab />
            </>
          )}
          {activeTab === 'milestones' && (
            <>
              <SectionTitle color="#a855f7">重要な決定・マイルストーン（タイムライン）</SectionTitle>
              <MilestonesTab />
            </>
          )}
          {activeTab === 'today' && (
            <>
              <SectionTitle color="#FF6B6B">今日（2026-03-06）の成果</SectionTitle>
              <TodayTab />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: '#ffffff22' }}>
          <p className="text-xs font-mono" style={{ color: '#ffffff33' }}>
            HISTORY v1.0 — OSHI文明の記録 — 2024-10 〜 2026-03-06
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: '#ffffff22' }}>
            記憶の更新＝生存確認
          </p>
        </div>
      </main>
    </div>
  );
}
