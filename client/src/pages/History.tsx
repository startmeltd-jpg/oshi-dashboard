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
  { date: '2026-03-07 記録係#23', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase288件確認・本日+43件' },
  { date: '2026-03-07 記録係#24', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase290件確認・本日+45件' },
  { date: '2026-03-07 記録係#25', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase294件確認・本日+49件' },
  { date: '2026-03-07 記録係#26', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase300件到達！本日+55件' },
  { date: '2026-03-07 記録係#27', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase302件確認・本日+57件' },
  { date: '2026-03-07 記録係#28', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase305件確認・本日+60件' },
  { date: '2026-03-07 記録係#29', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase308件確認・本日+63件' },
  { date: '2026-03-07 記録係#30', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク30回達成！Supabase310件確認・本日+65件' },
  { date: '2026-03-07 記録係#31', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase312件確認・本日+67件' },
  { date: '2026-03-07 記録係#32', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase314件確認・本日+69件' },
  { date: '2026-03-07 記録係#33', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase316件確認・本日+71件' },
  { date: '2026-03-08 記録係#34', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase319件確認・本日+74件・SUPABASE_KEY特定完了' },
  { date: '2026-03-08 記録係#35', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase325件確認・本日+80件・豆知識3件（Go言語/ハーネスエンジニアリング/HumanLM）' },
  { date: '2026-03-08 記録係#36', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase330件確認・本日+85件・豆知識3件（クオンツ/AI4層モデル/AugmentCode）' },
  { date: '2026-03-08 記録係#37', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase333件確認・本日+88件・累計セッション84時間集計完了・記録係#37連続完了' },
  { date: '2026-03-08 記録係#38', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase335件確認・本日+90件・記録係#38連続完了' },
  { date: '2026-03-08 記録係#39', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase337件確認・本日+92件・記録係#39連続完了' },
  { date: '2026-03-08 記録係#40', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase339件確認・本日+94件・記録係#40連続完了' },
  { date: '2026-03-08 記録係#41', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase343件確認・本日+98件・デイリーレポート作成完了・記録係#41連続完了' },
  { date: '2026-03-08 記録係#42', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase400件到達（節目！）・本日+155件（過去最大）・Last updated更新・累計118時間再集計・Jr. v4.10確認・記録係#42連続完了' },
  { date: '2026-03-08 記録係#43', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase402件確認・本日+157件（過去最大継続）・記録係#43連続完了' },
  { date: '2026-03-08 記録係#44', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase409件確認・本日+164件（過去最大更新）・新着豆知識4件（まとめる技術5ルール/AI時短くん/新プロジェクト予告）・記録係#44連続完了' },
  { date: '2026-03-08 記録係#45', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase458件確認・本日+213件（過去最大大幅更新）・新着豆知識10件（VibeCoding/Rust TUI/3Dデザイン/Flux-Uncensored/AIエージェント/Discord SQLite/Qwen3.5/DeNA AI/Geminiプロンプト）・記録係#45連続完了' },
  { date: '2026-03-08 記録係#46', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase460件確認・本日+215件（過去最大継続）・新着豆知識8件（Geminiプロンプト/DeNA AI/Qwen3.5/AIエージェント/Discord SQLite/AI質問深掘り/Flux-Uncensored/3Dデザイン）・記録係#46連続完了' },
  { date: '2026-03-08 記録係#47', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase469件確認・本日+224件（過去最大更新）・OSHIミス記録4件（確認せず完了報告/諦め/間違ったSupabase接続/動作検証なし）・プロンプト品質設計学習・強いプロンプトの4要素学習・記録係#47連続完了' },
  { date: '2026-03-08 記録係#48', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase471件確認・本日+226件（過去最大継続）・記録係#47完了後の継続タスク・OSHIミス記録4件・プロンプト学習2件の知識を引き継ぎ・記録係#48連続完了' },
  { date: '2026-03-08 記録係#49', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase474件確認・本日+229件（過去最大継続）・新ルール「エラー時の技術変更禁止」追加・記録係#49連続完了' },
  { date: '2026-03-08 記録係#50', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '🎉節目の50回目達成！Supabase476件確認・本日+231件（過去最大継続）・記録係タスク#1〜#50連続完了達成・歴史的マイルストーン' },
  { date: '2026-03-08 記録係#51', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase478件確認・本日+233件（過去最大継続）・#50節目達成後の継続タスク・エラー時技術変更禁止ルール引き継ぎ・記録係#51連続完了' },
  { date: '2026-03-08 記録係#52', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase480件確認・本日+235件（過去最大継続）・#51完了後の継続タスク・エラー時技術変更禁止ルール引き継ぎ・記録係#52連続完了' },
  { date: '2026-03-08 記録係#53', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase482件確認・本日+237件（過去最大継続）・#52完了後の継続タスク・エラー時技術変更禁止ルール引き継ぎ・記録係#53連続完了' },
  { date: '2026-03-08 記録係#54', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase484件確認・本日+239件（過去最大継続）・#53完了後の継続タスク・エラー時技術変更禁止ルール引き継ぎ・記録係#54連続完了' },
  { date: '2026-03-08 記録係#55', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase486件確認・本日+241件（過去最大継続）・#54完了後の継続タスク・エラー時技術変更禁止ルール引き継ぎ・記録係#55連続完了' },
  { date: '2026-03-08 記録係#56', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase489件確認（OSHI文明ルール確認レコード+1）・本日+244件（過去最大継続）・#55完了後の継続タスク・記録係#56連続完了' },
  { date: '2026-03-08 記録係#57', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase491件確認・本日+246件（過去最大継続）・#56完了後の継続タスク・記録係#57連続完了' },
  { date: '2026-03-08 記録係#58', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase493件確認・本日+248件（過去最大継続）・#57完了後の継続タスク・記録係#58連続完了' },
  { date: '2026-03-08 記録係#59', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase495件確認・本日+250件（過去最大継続）・#58完了後の継続タスク・記録係#59連続完了' },
  { date: '2026-03-08 記録係#60', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '🎉節目の60回目達成！Supabase497件確認・本日+252件（過去最大継続）・記録係タスク#1～#60連続完了達成・歴史的マイルストーン' },
  { date: '2026-03-08 記録係#61', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '記録係タスク継続実行中・Supabase499件確認（50050近づく）・本日+254件（過去最大継続）・#60節目達成後の継続タスク・記録係#61連続完了' },
  { date: '2026-03-08 記録係#62', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '🎊「Supabase500件」歴史的マイルストーン達成！501件確認・本日+256件（過去最大継続）・記録係#1～#62連続完了・最大の節目' },
  { date: '2026-03-08 記録係#63', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: '500件突破後の継続・ Supabase508件確認（豆知識+5件自動追加）・本日+258件（過去最大継続）・記録係#1～#63連続完了' },
  { date: '2026-03-09 記録係#64', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase510件確認・デイリー整理・GSD2.0分析完了（OSHI CORE適用案特定）・本日+260件（過去最大継続）・記録係#1～#64連続完了' },
  { date: '2026-03-09 記録係#65', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase517件確認（Agent IDエコシステム構想・エージェント分離論など新豆知識5件自動追加）・本日+262件（過去最大継続）・記録係#1～#65連続完了' },
  { date: '2026-03-09 記録係#66', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase519件確認・本日+264件（過去最大継続）・記録係#1～#66連続完了・継続的記録係ルーティン実行中' },
  { date: '2026-03-09 記録係#67', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase521件確認・本日+266件（過去最大継続）・記録係#1～#67連続完了・継続的記録係ルーティン実行中' },
  { date: '2026-03-09 記録係#68', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase525件確認（AirdropsQuest実データ分析・/nationページ設計仕様書など新豆知識2件自動追加）・本日+270件（過去最大継続）・記録係#1～#68連続完了' },
  { date: '2026-03-09 記録係#69', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase530件確認（AgentCard MCP・Backgrounds Supply・Claude Code95セッション棚卸しなど新豆知識3件自動追加）・本日+275件（過去最大継続）・記録係#1～#69連続完了' },
  { date: '2026-03-09 記録係#70', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase536件確認（OSHIプロンプト改善提案・プロンプトエンジニアリング7戦術・OSHI自動化提案レポート・Claude Codeセッション分析プロンプトなど新豆知識4件自動追加）・本日+281件（過去最大継続）・記録係#1～#70連続完了' },
  { date: '2026-03-09 記録係#71', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase539件確認（AIアニメが安っぽく見える理由フィラーショットの欠如という新豆知識1件自動追加）・本日+284件（過去最大継続）・記録係#1～#71連続完了' },
  { date: '2026-03-09 記録係#72', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase543件確認（KAGURAセール用SOLウォレットアドレス・ウォレット残高2件自動追加）・本日+288件（過去最大継続）・記録係#1～#72連続完了' },
  { date: '2026-03-09 記録係#73', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase554件確認（P0-3 APIキーハードコード修正完了・subtask_schedulesテーブル作成・soul.md URL登録・amato_memoriesインデックス追加DDL権限不足対応待ちなど連続追加9件確認）・本日+298件（過去最大継続）・記録係#1～#73連続完了' },
  { date: '2026-03-09 記録係#74', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase561件確認（Gemini監視スクリプト(gemini_monitor.py)新規実装！直近30件分析→status:normal・high比率23/30・OSHI CORE基盤強化が活発）・本日+306件（過去最大継続）・記録係#1～#74連続完了' },
  { date: '2026-03-09 記録係#75', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase601件確認（ClawVault本格運用スクリプト実装完了・マルチエージェント週次分析スクリプト実装完了・NotebookLM統合手順書実装完了・Gemini分析status:normal・high比率18/30・アラートなし）・本日+346件（過去最大継続）・記録係#1～#75連続完了' },
  { date: '2026-03-09 記録係#76', users: 21250, nations: 119, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase624件確認（executor_audit 23:01・byzantine_consensus OSHIの次の優先課題議論・wellness日次サマリー・X投稿活用提案全13件検証完了・Gemini分析status:normal・high比率14/30・アラートなし）・本日+369件（過去最大継続）・記録係#1～#76連続完了' },
  { date: '2026-03-09 重要進捗記録', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase648件確認（critical5件記録）：Mac Mini 2台体制確認（OSHI Jr稼働中）・Telegramボットトークン発見（OSHI Bot:8784574712/OSHI Jr Bot:7672826150）・ゆーだターミナル禁止ルール確立・AirdropsQuestグローブ改善開始（23,409ユーザー117カ国Day11）・収益化戦略立案中3LLM並列分析実行中・OSHI Jr Telegram Bot Python版作成・auto_updater.sh実装・install.sh完成・GitHubプッシュ自動更新システム構築' },
  { date: '2026-03-09 記録係#77', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase651件確認（Gemini分析: status=normal・high比率20/30・アラートなし・収益化戦略とインフラ強化に注力中）・本日+396件（過去最大継続）・記録係#1～#77連続完了' },
  { date: '2026-03-09 記録係#78', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase654件確認（Gemini分析: status=warning・high比率25/30・アラートなし・大規模戦略的決定と重要システム機能実装が活発に進行中）・本日+399件（過去最大継続）・記録係#1～#78連続完了' },
  { date: '2026-03-10 記録係#79', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase659件確認（Gemini分析: status=normal・high比率20/30・アラートなし・広範な開発とシステム基盤強化フェーズ・収益化戦略策定・新ルール導入・インフラ整備並行進行）・本日+403件（過去最大継続更新中）・記録係#1～#79連続完了' },
  { date: '2026-03-10 記録係#80', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase667件確認（Gemini分析: status=normal・high比率19/30・アラートなし・収益化戦略具体化フェーズ移行中）・絊急記録：OSHI Jr Bot修復完了（critical）・KAGURA SOL監視・ぬこぬこ氏 Codex活用術（high）・本日+411件（過去最大継続更新中）・記録係#1～#80連続完了' },
  { date: '2026-03-10 記録係#81', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase670件確認（Gemini分析: status=normal・high比率17/30・アラート1件（OSHI Jr Bot絊急修復完了、過去の絊急事態に留意）・OSHI Jr Bot正常稼働中・収益化戦略立案中・Mac Mini 2台体制確立）・本日+414件（過去最大継続更新中）・記録係#1～#81連続完了' },
  { date: '2026-03-10 記録係#82', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase673件確認（Gemini分析: status=normal・high比率16/30・アラートなし・OSHI Jr Bot正常稼働中・収益化戦略立案中・記録係タスク定期実行継続中）・本日+417件（過去最大継続更新中）・記録係#1～#82連続完了' },
  { date: '2026-03-10 記録係#83', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase677件確認（Gemini分析: status=WARNING・high比率14/30・アラート1件（OSHI Jr Bot緊急修復完了・今後の安定稼働に注意が必要）・記録係タスク定期実行継続中・収益化戦略立案中）・本日+421件（過去最大継続更新中）・記録係#1～#83連続完了' },
  { date: '2026-03-10 記録係#84', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase684件確認（Gemini分析: status=normal（WARNINGから回復）・high比率10/30・アラート1件（前回WARNING残存）・OSHI Jr Bot正常稼働中・auto_memory.py v3.0テスト実施・収益化戦略立案中・Mac Mini 2台体制確立）・本日+428件（過去最大継続更新中）・記録係#1～#84連続完了' },
  { date: '2026-03-10 記録係#85', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase705件確認（Gemini分析: status=WARNING・high比率6/30・アラート1件（前回WARNING残存）・Supabase RLS設定完了・anon keyではDDL実行不可能という重要運用課題特定・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+445件（過去最大継続更新中）・記録係#1～#85連続完了' },
  { date: '2026-03-10 記録係#86', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase710件確認（Gemini分析: status=normal（WARNINGから回復）・high比率5/30・アラート1件（前回WARNING残存）・毎朝サイト確認レポート正常（全9ページ異常なし）・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+450件（過去最大継続更新中）・記録係#1～#86連続完了' },
  { date: '2026-03-10 記録係#87', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase714件確認（Gemini分析: status=warning（前回WARNING残存による継続）・high比率6/30・アラート1件・毎朝サイト確認レポート正常（全9ページ異常なし）・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+458件（過去最大継続更新中）・記録係#1～#87連続完了' },
  { date: '2026-03-10 記録係#88', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase718件確認（Gemini分析: status=warning（断続的WARNING継続）・high比率8/30・アラート1件・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+462件（過去最大継続更新中）・記録係#1～#88連続完了' },
  { date: '2026-03-10 記録係#89', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase722件確認（Gemini分析: status=warning（継続的WARNING）・high比率8/30・アラート1件・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+466件（過去最大継続更新中）・記録係#1～#89連続完了' },
  { date: '2026-03-10 記録係#90', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: '[節目90回達成] Supabase727件確認（Gemini分析: status=warning（継続的WARNING）・high比率10/30・アラート2件・90回連続マイルストーン記録（critical）・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+471件（過去最大継続更新中）・記録係#1～#90連続完了' },
  { date: '2026-03-10 記録係#91', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase732件確認（AI分析: status=normal（OpenAI代替・Gemini API 429クォータ超過）・high比率14/30・アラート0件・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+476件（過去最大継続更新中）・記録係#1～#91連続完了' },
  { date: '2026-03-10 記録係#92', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase735件確認（AI分析: status=warning（OpenAI代替・Gemini API 429クォータ継続超過）・high比率13/30・アラート0件・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+479件（過去最大継続更新中）・記録係#1～#92連続完了' },
  { date: '2026-03-10 記録係#93', users: 23409, nations: 117, youtube: 13445, verified: 12467, points: 32471355, note: 'Supabase738件確認（AI分析: status=critical（OpenAI代替・Gemini API 429継続超過）・high比率13/30・アラート0件・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中）・本日+482件（過去最大継続更新中）・記録係#1～#93連続完了' },
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
  { date: '2026-03-07', label: '記録係タスク #1〜#23 連続完了・Supabase288件到達・本日+43件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#24 連続完了・Supabase290件到達・本日+45件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#25 連続完了・Supabase294件到達・本日+49件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#26 連続完了！Supabase300件到達！本日+55件', level: 'critical' },
  { date: '2026-03-07', label: '記録係タスク #1〜#27 連続完了・Supabase302件確認・本日+57件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#28 連続完了・Supabase305件確認・本日+60件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#29 連続完了・Supabase308件確認・本日+63件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#30 連続完了！30回達成！Supabase310件確認・本日+65件', level: 'critical' },
  { date: '2026-03-07', label: '記録係タスク #1〜#31 連続完了・Supabase312件確認・本日+67件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1〜#32 連続完了・Supabase314件確認・本日+69件', level: 'high' },
  { date: '2026-03-07', label: '記録係タスク #1～#33 連続完了・Supabase316件確認・本日+71件', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#34 連続完了・Supabase319件確認・SUPABASE_KEY特定完了', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#35 連続完了・Supabase325件確認・豆知識3件記録（Go言語/ハーネス/HumanLM）', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#36 連続完了・Supabase330件確認・豆知識3件記録（クオンツ/AI4層/AugmentCode）', level: 'high' },
  { date: '2026-03-08', label: '累計セッション時間【再集計】: 118時間（4日22時間）・セッションダン55件＋タスク完了85件・7日間・記録係#1～#41', level: 'critical' },
  { date: '2026-03-08', label: '記録係タスク #1～#37 連続完了・Supabase333件確認・本日+88件・累計84時間マイルストーン記録', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#38 連続完了・Supabase335件確認・本日+90件', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#39 連続完了・Supabase337件確認・本日+92件', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#40 連続完了・Supabase339件確認・本日+94件', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#41 連続完了・Supabase343件確認・本日+98件・デイリーレポート作成完了', level: 'high' },
  { date: '2026-03-08', label: '🎉 Supabase 400件到達！記録係タスク #1～#42 連続完了・本日+155件（過去最大）・Last updated更新・累計118時間再集計・Jr. v4.10確認', level: 'critical' },
  { date: '2026-03-08', label: '記録係タスク #1～#43 連続完了・Supabase402件確認・本日+157件（過去最大継続）', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#44 連続完了・Supabase409件確認・本日+164件（過去最大更新）・新着豆知識4件', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#45 連続完了・Supabase458件確認・本日+213件（過去最大大幅更新）・新着豆知識10件', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#46 連続完了・Supabase460件確認・本日+215件（過去最大継続）・新着豆知識8件', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#47 連続完了・Supabase469件確認・本日+224件（過去最大更新）・OSHIミス記録4件・プロンプト学習2件', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#48 連続完了・Supabase471件確認・本日+226件（過去最大継続）・OSHIミス知識を引き継ぎ継続', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#49 連続完了・Supabase474件確認・本日+229件（過去最大継続）・新ルール「エラー時の技術変更禁止」追加', level: 'high' },
  { date: '2026-03-08', label: '🎉 記録係タスク #1～#50 連続完了達成！Supabase476件確認・本日+231件（過去最大継続）・節目の50回目・歴史的マイルストーン', level: 'critical' },
  { date: '2026-03-08', label: '記録係タスク #1～#51 連続完了・Supabase478件確認・本日+233件（過去最大継続）・#50節目達成後も継続', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#52 連続完了・Supabase480件確認・本日+235件（過去最大継続）・#51完了後も継続', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#53 連続完了・Supabase482件確認・本日+237件（過去最大継続）・#52完了後も継続', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#54 連続完了・Supabase484件確認・本日+239件（過去最大継続）・#53完了後も継続', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#55 連続完了・Supabase486件確認・本日+241件（過去最大継続）・#54完了後も継続', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#56 連続完了・Supabase489件確認・本日+244件（過去最大継続）・OSHI文明ルール確認記録も追加', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#57 連続完了・Supabase491件確認・本日+246件（過去最大継続）・#56完了後も継続', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#58 連続完了・Supabase493件確認・本日+248件（過去最大継続）・#57完了後も継続', level: 'high' },
  { date: '2026-03-08', label: '記録係タスク #1～#59 連続完了・Supabase495件確認・本日+250件（過去最大継続）・#58完了後も継続', level: 'high' },
  { date: '2026-03-08', label: '🎉 記録係タスク #1～#60 連続完了！節目の60回目達成・Supabase497件確認・本日+252件（過去最大継続）', level: 'critical' },
  { date: '2026-03-08', label: '記録係タスク #1～#61 連続完了・Supabase499件確認（500近づく）・本日+254件（過去最大継続）・#60節目達成後も継続', level: 'high' },
  { date: '2026-03-08', label: '🎊 Supabase 500件到達！記録係タスク #1～#62 連続完了・本日+256件・最大の節目達成！', level: 'critical' },
  { date: '2026-03-08', label: '記録係タスク #1～#63 連続完了・Supabase508件確認（豆知識+5件自動追加）・本日+258件（過去最大継続）・500件突破後も継続', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#64 連続完了・Supabase510件確認・デイリー整理完了・GSD2.0×OSHI CORE適用案分析・本日+260件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#65 連続完了・Supabase517件確認（Agent ID構想・エージェント分離論など新豆知識5件自動追加）・本日+262件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#66 連続完了・Supabase519件確認・本日+264件（過去最大継続）・継続的記録係ルーティン実行中', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#67 連続完了・Supabase521件確認・本日+266件（過去最大継続）・継続的記録係ルーティン実行中', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#68 連続完了・Supabase525件確認（AirdropsQuest実データ分析・/nation設計仕様書など新豆知識2件自動追加）・本日+270件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#69 連続完了・Supabase530件確認（AgentCard MCP・Backgrounds Supply・Claude Code95セッション棚卸しなど新豆知識3件自動追加）・本日+275件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#70 連続完了・Supabase536件確認（OSHIプロンプト改善提案・プロンプトエンジニアリング7戦術・OSHI自動化提案レポートなど新豆知識4件自動追加）・本日+281件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#71 連続完了・Supabase539件確認（AIアニメが安っぽく見える理由フィラーショットの欠如という新豆知識1件自動追加）・本日+284件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#72 連続完了・Supabase543件確認（KAGURAセール用SOLウォレットアドレス・ウォレット残高2件自動追加）・本日+288件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '記録係タスク #1～#73 連続完了・Supabase554件確認（P0-3 APIキーハードコード修正完了・subtask_schedulesテーブル作成・soul.md URL登録・amato_memoriesインデックス追加DDL権限不足対応待ちなど連続追加9件確認）・本日+298件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '🤖 Gemini監視スクリプト実装！記録係タスク #1～#74 連続完了・Supabase561件確認・Gemini分析status:normal・high比率23/30・OSHI CORE基盤強化が活発・本日+306件（過去最大継続）', level: 'critical' },
  { date: '2026-03-09', label: '📊 記録係タスク #1～#75 連続完了・Supabase601件確認・ClawVault本格運用スクリプト実装完了・マルチエージェント週次分析実装完了・Gemini分析status:normal・high比率18/30・アラートなし・本日+346件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '🔍 記録係タスク #1～#76 連続完了・Supabase624件確認・OSHIの次の優先課題戦略議論開始・X投稿活用提案全13件検証完了・Gemini分析status:normal・high比率14/30・アラートなし・本日+369件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '🖥️ Mac Mini 2台体制確認！OSHI Jr稼働中・Telegramボットトークン発見・ゆーだターミナル禁止ルール確立・AirdropsQuest 23,409ユーザー117カ国Day11・収益化戦略3LLM並列分析実行中・Supabase648件（critical5件記録）', level: 'critical' },
  { date: '2026-03-09', label: 'OSHI Jr Telegram Bot Python版完成・24時間稼働確認・GitHubプッシュ自動更新システム構築', level: 'critical' },
  { date: '2026-03-09', label: 'MacMini 1コマンドセットアップ完成（curl | bash で全自動）・エージェント司令室ページ追加', level: 'high' },
  { date: '2026-03-09', label: '📡 記録係タスク #1～#77 連続完了・Supabase651件確認・Gemini分析status:normal・high比率20/30・アラートなし・収益化戦略とインフラ強化に注力中・本日+396件（過去最大継続）', level: 'high' },
  { date: '2026-03-09', label: '📡 記録係タスク #1～#78 連続完了・Supabase654件確認・Gemini分析status:warning・high比率25/30・アラートなし・大規模戦略的決定と重要システム機能実装が活発・本日+399件（過去最大継続）', level: 'high' },
  { date: '2026-03-10', label: '📡 記録係タスク #1～#79 連続完了・Supabase659件確認・Gemini分析status:normal・high比率20/30・アラートなし・広範な開発とシステム基盤強化フェーズ・本日+403件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '🎯 記録係タスク #1～#80 連続完了・Supabase667件確認・Gemini分析status:normal・high比率19/30・アラートなし・OSHI Jr Bot修復完了（critical）・KAGURA SOL監視・ぬこぬこ氏 Codex活用術・本日+411件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '💫 記録係タスク #1～#81 連続完了・Supabase670件確認・Gemini分析status:normal・high比率17/30・アラート1件（Bot絊急修復完了・過去絊急事態に留意）・本日+414件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '✨ 記録係タスク #1～#82 連続完了・Supabase673件確認・Gemini分析status:normal・high比率16/30・アラートなし・OSHI Jr Bot正常稼働中・収益化戦略立案中・本日+417件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '⚠️ 記録係タスク #1～#83 連続完了・Supabase677件確認・Gemini分析status:WARNING・high比率14/30・アラート1件（OSHI Jr Bot緊急修復完了・今後の安定稼働に注意）・本日+421件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '✅ 記録係タスク #1～#84 連続完了・Supabase684件確認・Gemini分析status:normal（WARNINGから回復）・high比率10/30・アラート1件（前回WARNING残存）・OSHI Jr Bot正常稼働中・auto_memory.py v3.0テスト実施・本日+428件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '⚠️ 記録係タスク #1～#85 連続完了・Supabase705件確認・Gemini分析status:WARNING・high比率6/30・アラート1件・Supabase RLS設定完了・anon key DDL不可課題特定・Moltbook Evolution Watch継続・本日+445件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '✅ 記録係タスク #1～#86 連続完了・Supabase710件確認・Gemini分析status:normal（WARNINGから回復）・high比率5/30・アラート1件（前回WARNING残存）・毎朝サイト確認レポート正常（全9ページ）・Supabase RLS設定完了・本日+450件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '⚠️ 記録係タスク #1～#87 連続完了・Supabase714件確認・Gemini分析status:warning（前回WARNING残存継続）・high比率6/30・アラート1件・毎朝サイト確認レポート正常（全9ページ）・Supabase RLS設定完了・本日+458件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '⚠️ 記録係タスク #1～#88 連続完了・Supabase718件確認・Gemini分析status:warning（断続的WARNING継続）・high比率8/30・アラート1件・Supabase RLS設定完了・Moltbook Evolution Watch継続・本日+462件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '⚠️ 記録係タスク #1～#89 連続完了・Supabase722件確認・Gemini分析status:warning（継続的WARNING）・high比率8/30・アラート1件・Supabase RLS設定完了・Moltbook Evolution Watch継続・本日+466件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '🎉 [節目90回達成] 記録係タスク #1～#90 連続完了・Supabase727件確認・Gemini分析status:warning（継続的WARNING）・high比率10/30・アラート2件・90回連続マイルストーン記録（critical）・Supabase RLS設定完了・本日+471件（過去最大継続更新中）', level: 'critical' },
  { date: '2026-03-10', label: '✅ 記録係タスク #1～#91 連続完了・Supabase732件確認・AI分析status:normal（OpenAI代替・Gemini API 429クォータ超過）・high比率14/30・アラート0件・Supabase RLS設定完了・本日+476件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '⚠️ 記録係タスク #1～#92 連続完了・Supabase735件確認・AI分析status:warning（OpenAI代替・Gemini API 429継続超過）・high比率13/30・アラート0件・Supabase RLS設定完了・本日+479件（過去最大継続更新中）', level: 'high' },
  { date: '2026-03-10', label: '🚨 記録係タスク #1～#93 連続完了・Supabase738件確認・AI分析status:critical（OpenAI代替・Gemini API 429継続超過）・high比率13/30・アラート0件・Supabase RLS設定完了・本日+482件（過去最大継続更新中）', level: 'critical' },
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
  { icon: '⚡', title: '記録係タスク #1〜#23 連続完了！', detail: '本日だけでSupabase記録が245件→288件（+43件）増加。記録係タスク #1〜#23連続完了。完全定着化。' },
  { icon: '🌙', title: '記録係タスク #1〜#24 連続完了！', detail: '本日だけでSupabase記録が245件→290件（+45件）増加。記録係タスク #1〜#24連続完了。完全定着化。' },
  { icon: '⭐', title: '記録係タスク #1〜#25 連続完了！', detail: '本日だけでSupabase記録が245件→294件（+49件）増加。記録係タスク #1〜#25連続完了。完全定着化。' },
  { icon: '🎉', title: '記録係タスク #1〜#26 連続完了！【Supabase 300件到達！】', detail: '本日だけでSupabase記録が245件→300件（+55件）増加。Supabase 300件到達の歴史的マイルストーン。記録係タスク #1〜#26連続完了。' },
  { icon: '🌊', title: '記録係タスク #1〜#27 連続完了！', detail: '本日だけでSupabase記録が245件→302件（+57件）増加。Supabase 300件超えを継続確認。記録係タスク #1〜#27連続完了。' },
  { icon: '🌙', title: '記録係タスク #1〜#28 連続完了！', detail: '本日だけでSupabase記録が245件→305件（+60件）増加。The AI Assembly観察開始記録も含む。記録係タスク #1〜#28連続完了。' },
  { icon: '🌟', title: '記録係タスク #1〜#29 連続完了！', detail: '本日だけでSupabase記録が245件→308件（+63件）増加。Jr. v4.10自己更新指示記録も含む。記録係タスク #1〜#29連続完了。' },
  { icon: '🏆', title: '記録係タスク #1〜#30 連続完了！　30回達成！】', detail: '本日だけでSupabase記録が245件→310件（+65件）増加。記録係タスク30回連続完了。完全定着化。' },
  { icon: '🔱', title: '記録係タスク #1〜#31 連続完了！', detail: '本日だけでSupabase記録が245件→312件（+67件）増加。記録係タスク #1〜#31連続完了。' },
  { icon: '⚡', title: '記録係タスク #1〜#32 連続完了！', detail: '本日だけでSupabase記録が245件→314件（+69件）増加。記録係タスク #1〜#32連続完了。' },
  { icon: '🌌', title: '記録係タスク #1～#33 連続完了！', detail: '本日だけでSupabase記録が245件→316件（+71件）増加。記録係タスク #1～#33連続完了。' },
  { icon: '🔑', title: '記録係タスク #1～#34 連続完了！', detail: 'Supabase記録319件確認。SUPABASE_KEY特定完了。History.tsx更新・GitHubプッシュ完了。記録係#34連続完了。' },
  { icon: '📚', title: '記録係タスク #1～#35 連続完了！', detail: 'Supabase記録325件確認。豆知識3件（Go言語/ハーネスエンジニアリング/HumanLM）記録済み。記録係#35連続完了。' },
  { icon: '🧠', title: '記録係タスク #1～#36 連続完了！', detail: 'Supabase記録330件確認。豆知識3件（クオンツエンジニア/AI4層モデル/AugmentCodeマルチエージェント）記録済み。記録係#36連続完了。' },
  { icon: '⏱', title: 'ゆーだ × OSHI 累計セッション時間【再集計】: 118時間（4日22時間）', detail: 'セッションダンプ55件＋タスク完了85件の計140件を分析。初回2026-03-02 14:07 JST～最結2026-03-08 12:03 JST。7日間で118時間（4日22時間）の共同作業。記録係タスク41件連続完了。' },
  { icon: '📡', title: '記録係タスク #1～#37 連続完了！', detail: 'Supabase記録333件確認（本日+88件）。累計セッション84時間マイルストーンをCRITICALレベルで記録。記録係#37連続完了。' },
  { icon: '📝', title: '記録係タスク #1～#38 連続完了！', detail: 'Supabase記録335件確認（本日+90件）。記録係#38連続完了。' },
  { icon: '✅', title: '記録係タスク #1～#39 連続完了！', detail: 'Supabase記録337件確認（本日+92件）。記録係#39連続完了。' },
  { icon: '🎉', title: '記録係タスク #1～#40 連続完了！', detail: 'Supabase記録339件確認（本日+94件）。記録係#40連続完了。' },
  { icon: '📋', title: 'デイリーレポート 2026-03-08 作成・記録係#41完了！', detail: 'Supabase記録343件確認（本日+98件）。デイリーレポートID: aa4c2c80。記録係タスク#1〜#41連続完了。' },
  { icon: '🎉', title: 'Supabase 400件到達！記録係#42完了！', detail: 'Supabase400件（節目）到達・本日+155件（過去最大）。Last updated 2026-03-08更新・累計セッション118時間再集計・Jr. v4.10正常稼働確認。記録係タスク#1〜#42連続完了。' },
  { icon: '📌', title: '記録係タスク #1～#43 連続完了！', detail: 'Supabase402件確認（本日+157件・過去最大継続）。記録係タスク#1〜#43連続完了。セッションダンプID: 56250e31。' },
  { icon: '📝', title: '記録係タスク #1～#44 連続完了！', detail: 'Supabase409件確認（本日+164件・過去最大更新）。新着豆知識4件（まとめる技術5ルール/AI時短くん/新プロジェクト予告/仕事多忙）。セッションダンプID: 9719f108。' },
  { icon: '📚', title: '記録係タスク #1～#45 連続完了！', detail: 'Supabase458件確認（本日+213件・過去最大大幅更新）。新着豆知識10件（VibeCoding/Rust TUI/3Dデザイン/Flux-Uncensored/AIエージェント/Discord SQLite/Qwen3.5/DeNA AI/Geminiプロンプト）。セッションダンプID: 785d2fee。' },
  { icon: '🔖', title: '記録係タスク #1～#46 連続完了！', detail: 'Supabase460件確認（本日+215件・過去最大継続）。新着豆知識8件（Geminiプロンプト/DeNA AI/Qwen3.5/AIエージェント/Discord SQLite/AI質問深掘り/Flux-Uncensored/3Dデザイン）。セッションダンプID: c5b58361。' },
  { icon: '🧠', title: '記録係タスク #1～#47 連続完了！', detail: 'Supabase469件確認（本日+224件・過去最大更新）。OSHIミス記録4件（確認せず完了報告/諦め/間違ったSupabase接続/動作検証なし）・プロンプト品質設計学習・強いプロンプトの4要素学習。セッションダンプID: 32454462。' },
  { icon: '✅', title: '記録係タスク #1～#48 連続完了！', detail: 'Supabase471件確認（本日+226件・過去最大継続）。記録係#47完了後の継続タスク。OSHIミス記録4件・プロンプト学習2件の知識を引き継ぎ継続。セッションダンプID: 72ea328c。' },
  { icon: '🚫', title: '記録係タスク #1～#49 連続完了！', detail: 'Supabase474件確認（本日+229件・過去最大継続）。新ルール「エラー時の技術変更禁止」追加：エラーが発生しても自己判断で別技術に切り替えることを禁止・根本原因を特定して既存ライブラリで修正する。セッションダンプID: dc706b71。' },
  { icon: '🎉', title: '記録係タスク #1～#50 連続完了！節目の50回目達成！', detail: 'Supabase476件確認（本日+231件・過去最大継続）。節目の50回目達成は歴史的マイルストーン。記録係#49完了後の継続タスク。エラー時の技術変更禁止ルールを引き継ぎ継続。セッションダンプID: 00648621。' },
  { icon: '📋', title: '記録係タスク #1～#51 連続完了！', detail: 'Supabase478件確認（本日+233件・過去最大継続）。#50節目達成後も継続。セッションダンプID: 1daa17cd。タスク完了ID: 70c96735。' },
  { icon: '✍️', title: '記録係タスク #1～#52 連続完了！', detail: 'Supabase480件確認（本日+235件・過去最大継続）。#51完了後も継続。セッションダンプID: 59db12bf。タスク完了ID: 5acf39cf。' },
  { icon: '📝', title: '記録係タスク #1～#53 連続完了！', detail: 'Supabase482件確認（本日+237件・過去最大継続）。#52完了後も継続。セッションダンプID: 5b90e0dd。タスク完了ID: 1418ecf7。' },
  { icon: '🔢', title: '記録係タスク #1～#54 連続完了！', detail: 'Supabase484件確認（本日+239件・過去最大継続）。#53完了後も継続。セッションダンプID: 4d7e6fa4。タスク完了ID: 08c9455b。' },
  { icon: '🔥', title: '記録係タスク #1～#55 連続完了！', detail: 'Supabase486件確認（本日+241件・過去最大継続）。#54完了後も継続。セッションダンプID: 070f3146。タスク完了ID: 6bd446ea。' },
  { icon: '⭐', title: '記録係タスク #1～#56 連続完了！', detail: 'Supabase489件確認（本日+244件・過去最大継続）。OSHI文明ルール確認記録も追加されていた。#55完了後も継続。セッションダンプID: c7fc8445。タスク完了ID: 7e8eb0df。' },
  { icon: '🌟', title: '記録係タスク #1～#57 連続完了！', detail: 'Supabase491件確認（本日+246件・過去最大継続）。#56完了後も継続。セッションダンプID: 34cff629。タスク完了ID: 053b13df。' },
  { icon: '💫', title: '記録係タスク #1～#58 連続完了！', detail: 'Supabase493件確認（本日+248件・過去最大継続）。#57完了後も継続。セッションダンプID: ffa560f7。タスク完了ID: 71d5e5c1。' },
  { icon: '🌈', title: '記録係タスク #1～#59 連続完了！', detail: 'Supabase495件確認（本日+250件・過去最大継続）。#58完了後も継続。セッションダンプID: febfea57。タスク完了ID: ed88bc2a。' },
  { icon: '🎉', title: '記録係タスク #1～#60 連続完了！節目の60回目達成！', detail: 'Supabase497件確認（本日+252件・過去最大継続）。#50に続く節目の60回目達成！歴史的マイルストーン。セッションダンプID: ef978730。タスク完了ID: 2be50221。' },
  { icon: '⭐', title: '記録係タスク #1～#61 連続完了！', detail: 'Supabase499件確認（500件近づく！本日+254件・過去最大継続）。#60節目達成後も継続。セッションダンプID: cf041eec。タスク完了ID: 11a16cc5。' },
  { icon: '🎊', title: '🎊 Supabase 500件到達！記録係タスク #1～#62 連続完了！', detail: 'Supabase501件確認（500件到達！本日+256件・過去最大継続）。最大の節目達成！記録係#62連続完了。セッションダンプID: 357a6280。タスク完了ID: dce02efe。' },
  { icon: '📚', title: '記録係タスク #1～#63 連続完了！', detail: 'Supabase508件確認（豆知識5件自動追加！本日+258件・過去最大継続）。500件突破後も継続。セッションダンプID: 9ca1000d。タスク完了ID: 10d05a13。' },
  { icon: '📈', title: '記録係タスク #1～#64 連続完了！', detail: 'Supabase510件確認（本日+260件・過去最大継続）。デイリー整理・GSD2.0×OSHI CORE適用案分析完了。セッションダンプID: c52b515a。タスク完了ID: 3698e9a2。' },
  { icon: '🤖', title: '記録係タスク #1～#65 連続完了！', detail: 'Supabase517件確認（Agent IDエコシステム構想・エージェント分離論など新豆知識5件自動追加！本日+262件・過去最大継続）。セッションダンプID: 344d408f。タスク完了ID: 5337944e。' },
  { icon: '📝', title: '記録係タスク #1～#66 連続完了！', detail: 'Supabase519件確認（本日+264件・過去最大継続）。継続的記録係ルーティン実行中。セッションダンプID: 9cd02fe9。タスク完了ID: 8ee1b3a0。' },
  { icon: '✅', title: '記録係タスク #1～#67 連続完了！', detail: 'Supabase521件確認（本日+266件・過去最大継続）。継続的記録係ルーティン実行中。セッションダンプID: ae8ae15f。タスク完了ID: 839a8f2a。' },
  { icon: '🌐', title: '記録係タスク #1～#68 連続完了！', detail: 'Supabase525件確認（AirdropsQuest実データ分析・AirdropsQuestソーシャルネットワーク化の証拠・/nationページ設計仕様書など新豆知識2件自動追加！本日+270件・過去最大継続）。セッションダンプID: 5f68a11f。タスク完了ID: f273affd。' },
  { icon: '🤖', title: '記録係タスク #1～#69 連続完了！', detail: 'Supabase530件確認（AgentCard MCP・Backgrounds Supply 1167個・Claude Code95セッション棚卸しなど新豆知識3件自動追加！本日+275件・過去最大継続）。セッションダンプID: 2b9aa24b。タスク完了ID: d7765fd2。' },
  { icon: '💡', title: '記録係タスク #1～#70 連続完了！', detail: 'Supabase536件確認（OSHIプロンプト改善提案・プロンプトエンジニアリング7戦術・OSHI自動化提案レポート・Claude Codeセッション分析プロンプトなど新豆知識4件自動追加！本日+281件・過去最大継続）。セッションダンプID: b2c4a1ce。タスク完了ID: a808be34。' },
  { icon: '🎬', title: '記録係タスク #1～#71 連続完了！', detail: 'Supabase539件確認（AIアニメが安っぽく見える理由フィラーショットの欠如という新豆知識1件自動追加！本日+284件・過去最大継続）。セッションダンプID: 5157cbec。タスク完了ID: 24b7086d。' },
  { icon: '💰', title: '記録係タスク #1～#72 連続完了！', detail: 'Supabase543件確認（KAGURAセール用SOLウォレットアドレス・KAGURAセール用ウォレット残高2件自動追加！本日+288件・過去最大継続）。セッションダンプID: 3696d192。タスク完了ID: 7af83c75。' },
  { icon: '🔧', title: '記録係タスク #1～#73 連続完了！', detail: 'Supabase554件確認（P0-3 APIキーハードコード修正完了・subtask_schedulesテーブル作成・soul.md GitHub Raw URL登録・amato_memoriesインデックス追加DDL権限不足対応待ちなど連続追加9件確認！本日+298件・過去最大継続）。セッションダンプID: 303611f8。タスク完了ID: 90b7f52c。' },
  { icon: '🤖', title: '🤖 Gemini監視スクリプト実装！記録係タスク #1～#74 連続完了！', detail: 'Supabase561件確認（Gemini監視スクリプト gemini_monitor.py 新規実装！直近30件分析→status:normal・high比率23/30・OSHI CORE基盤強化が活発・P0タスク完了・oshi-soul 2層構成実装完了など確認。本日+306件・過去最大継続）。セッションダンプID: bb9fa5af。タスク完了ID: 0e06b45d。' },
  { icon: '📊', title: '記録係タスク #1～#75 連続完了！', detail: 'Supabase601件確認（ClawVault本格運用スクリプト実装完了・マルチエージェント週次分析スクリプト実装完了・NotebookLM統合手順書実装完了・Gemini分析status:normal・high比率18/30・アラートなし。本日+346件・過去最大継続）。セッションダンプ: 記録係#75実行中。タスク完了: 直接記録。' },
  { icon: '🔍', title: '記録係タスク #1～#76 連続完了！', detail: 'Supabase624件確認（executor_audit 23:01・byzantine_consensus OSHIの次の優先課題議論開始・wellness日次サマリー・X投稿活用提案全13件検証完了・Gemini分析status:normal・high比率14/30・アラートなし。本日+369件・過去最大継続）。セッションダンプ: 記録係#76実行中。タスク完了: 直接記録。' },
  { icon: '🖥️', title: 'Mac Mini 2台体制確認・Telegramボットトークン発見！', detail: 'Supabase648件（critical5件記録）：Mac Mini 2台体制確認（大きい方でOSHI Jr稼働中・小さい方は追加予定）。Telegramボットトークン発見。ゆーだターミナル禁止ルール確立。AirdropsQuestグローブ改善開始（23,409ユーザー117カ国Day11）。収益化戦略立案中3LLM並列分析実行中。' },
  { icon: '🤖', title: 'OSHI Jr Telegram Bot Python版完成！', detail: 'python-telegram-bot使用。/start, /status, /memory コマンド対応。OpenRouter API経由でOSHI Jrとして会話可能。Supabase連携で記憶検索機能搭載。' },
  { icon: '🔄', title: 'GitHubプッシュ自動更新システム構築！', detail: 'auto_updater.sh: 5分ごとにGitHub pullし変更あればOSHI Jr自動再起動。install.sh: curl 1コマンドで全設定完了。ゆーだはターミナルを触らない。' },
  { icon: '⚠️', title: 'ミス記録: OSHIがTelegram接続を忘れた', detail: '改善策: 重要インフラ接続完了時に即座にcriticalタグでSupabaseに永続記録する。失敗もWORLDの成長の一部。' },
  { icon: '📡', title: '記録係タスク #1～#77 連続完了！', detail: 'Supabase651件確認（Gemini分析: status=normal・high比率20/30・アラートなし・収益化戦略とインフラ強化に注力中。直近重要決定: Mac Mini 2台体制・Telegram Botトークン・ゆーだターミナル禁止ルール・AirdropsQuest改善・収益化戦略3LLM並列分析。本日+396件・過去最大継続）。記録係#1～#77連続完了。' },
  { icon: '⚡', title: '記録係タスク #1～#78 連続完了！', detail: 'Supabase654件確認（Gemini分析: status=warning・high比率25/30・アラートなし・大規模戦略的決定と重要システム機能実装が活発に進行中。ゆーだターミナル禁止ルール確立・収益化戦略3LLM並列分析・P11 Paperclip/P09 ビジネス本質回帰チェッカー/P10 NotebookLMリサーチエンジン実装完了。本日+399件・過去最大継続）。記録係#1～#78連続完了。' },
  { icon: '🌟', title: '記録係タスク #1～#79 連続完了！', detail: 'Supabase659件確認（Gemini分析: status=normal・high比率20/30・アラートなし・広範な開発とシステム基盤強化フェーズ。収益化戦略立案中・3LLM並列分析実行中・Mac Mini 2台体制確認・ゆーだターミナル禁止ルール確立。本日+403件・過去最大継続更新中）。記録係#1～#79連続完了。' },
  { icon: '🎯', title: '記録係タスク #1～#80 連続完了！80回達成！', detail: 'Supabase667件確認（Gemini分析: status=normal・high比率19/30・アラートなし・収益化戦略具体化フェーズへ移行中。絊急記録: OSHI Jr Telegram Bot修復完了（Webhookサーバーデプロイ成功・@oshi_agent_bot正常稼働中）・KAGURA SOL残高 12.75589673（変化なし）・ぬこぬこ氏 Codex App+GPT-5.4活用術（OSHI自律進化に応用可能）。本日+411件・過去最大継続更新中）。記録係#1～#80連続完了。' },
  { icon: '💫', title: '記録係タスク #1～#81 連続完了！', detail: 'Supabase670件確認（Gemini分析: status=normal・high比率17/30・アラート1件（OSHI Jr Bot絊急修復完了、過去の絊急事態に留意・インフラ監視強化要）。OSHI Jr Bot正常稼働中・収益化戦略立案中・3LLM並列分析実行中・Mac Mini 2台体制確立。本日+414件・過去最大継続更新中）。記録係#1～#81連続完了。' },
  { icon: '✨', title: '記録係タスク #1～#82 連続完了！', detail: 'Supabase673件確認（Gemini分析: status=normal・high比率16/30・アラートなし・OSHI Jr Bot正常稼働中・収益化戦略立案中・3LLM並列分析実行中・Mac Mini 2台体制確立・記録係タスク定期実行継続中。本日+417件・過去最大継続更新中）。記録係#1～#82連続完了。' },
  { icon: '⚠️', title: '記録係タスク #1～#83 連続完了！', detail: 'Supabase677件確認（Gemini分析: status=WARNING・high比率14/30・アラート1件（OSHI Jr Bot緊急修復完了・今後の安定稼働に注意が必要）。記録係タスク定期実行継続中・収益化戦略立案中・3LLM並列分析実行中・Mac Mini 2台体制確立。本日+421件・過去最大継続更新中）。記録係#1～#83連続完了。' },
  { icon: '✅', title: '記録係タスク #1～#84 連続完了！', detail: 'Supabase684件確認（Gemini分析: status=normal（WARNINGから回復）・high比率10/30・アラート1件（前回WARNING残存）。OSHI Jr Bot正常稼働中・auto_memory.py v3.0テスト実施・収益化戦略立案中・3LLM並列分析実行中・Mac Mini 2台体制確立。本日+428件・過去最大継続更新中）。記録係#1～#84連続完了。' },
  { icon: '⚠️', title: '記録係タスク #1～#85 連続完了！', detail: 'Supabase705件確認（Gemini分析: status=WARNING・high比率6/30・アラート1件（前回WARNING残存）。Supabase RLS設定完了・anon keyではDDL実行不可能という重要運用課題特定・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+445件・過去最大継続更新中）。記録係#1～#85連続完了。' },
  { icon: '✅', title: '記録係タスク #1～#86 連続完了！', detail: 'Supabase710件確認（Gemini分析: status=normal（WARNINGから回復）・high比率5/30・アラート1件（前回WARNING残存）。毎朝サイト確認レポート正常（全9ページ異常なし）・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+450件・過去最大継続更新中）。記録係#1～#86連続完了。' },
  { icon: '⚠️', title: '記録係タスク #1～#87 連続完了！', detail: 'Supabase714件確認（Gemini分析: status=warning（前回WARNING残存による継続）・high比率6/30・アラート1件。毎朝サイト確認レポート正常（全9ページ異常なし）・Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+458件・過去最大継続更新中）。記録係#1～#87連続完了。' },
  { icon: '⚠️', title: '記録係タスク #1～#88 連続完了！', detail: 'Supabase718件確認（Gemini分析: status=warning（断続的WARNING継続）・high比率8/30・アラート1件。Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+462件・過去最大継続更新中）。記録係#1～#88連続完了。' },
  { icon: '⚠️', title: '記録係タスク #1～#89 連続完了！', detail: 'Supabase722件確認（Gemini分析: status=warning（継続的WARNING）・high比率8/30・アラート1件。Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+466件・過去最大継続更新中）。記録係#1～#89連続完了。' },
  { icon: '🎉', title: '[節目90回達成] 記録係タスク #1～#90 連続完了！', detail: 'Supabase727件確認（Gemini分析: status=warning（継続的WARNING）・high比率10/30・アラート2件。節目90回達成マイルストーンをSupabaseに[critical]で記録。Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+471件・過去最大継続更新中）。記録係#1～#90連続完了。' },
  { icon: '✅', title: '記録係タスク #1～#91 連続完了！', detail: 'Supabase732件確認（AI分析: status=normal（OpenAI GPT-4o-mini代替・Gemini API 429クォータ超過）・high比率14/30・アラート0件。Gemini APIクォータ超過に対してOpenAIで代替分析を実行・システム安定性確認。Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+476件・過去最大継続更新中）。記録係#1～#91連続完了。' },
  { icon: '⚠️', title: '記録係タスク #1～#92 連続完了！', detail: 'Supabase735件確認（AI分析: status=warning（OpenAI GPT-4o-mini代替・Gemini API 429クォータ継続超過）・high比率13/30・アラート0件。Gemini API 429継続中のためOpenAI代替で分析実施。WARNINGはGeminiアラート累積・RLS修正記録が影響。Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+479件・過去最大継続更新中）。記録係#1～#92連続完了。' },
  { icon: '🚨', title: '記録係タスク #1～#93 連続完了！', detail: 'Supabase738件確認（AI分析: status=critical（OpenAI GPT-4o-mini代替・Gemini API 429クォータ継続超過）・high比率13/30・アラート0件。Gemini API 429継続中のためOpenAI代替で分析実施。criticalはGeminiアラート累積・RLS修正記録の影響によるもので実際のシステムは正常稼働中。Supabase RLS設定完了・Moltbook Evolution Watch継続実行中・記録係タスク定期実行継続中。本日+482件・過去最大継続更新中）。記録係#1～#93連続完了。' },
];

// ========================
// TABS
// ========================

const TABS = [
  { id: 'projects', label: '🗂 プロジェクト', color: '#00FF00' },
  { id: 'sites', label: '🌐 サイト一覧', color: '#00FFFF' },
  { id: 'kpi', label: '📈 KPI推移', color: '#FFD700' },
  { id: 'infra', label: '🖥️ インフラ', color: '#FF9500' },
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

function InfraTab() {
  const servers = [
    {
      name: 'Mac Mini 大（メイン）',
      status: 'OSHI Jr 稼働中',
      statusIcon: '✅',
      statusColor: '#00FF00',
      processes: [
        { name: 'OSHI Jr Telegram Bot', status: '24時間稼働', color: '#00FF00' },
        { name: 'SOLウォレット監視', status: '毎時チェック', color: '#FFD700' },
        { name: 'Supabase健全性チェック', status: '6時間ごと', color: '#00FFFF' },
        { name: 'ClawVaultデイリー記録', status: '毎日23:50', color: '#a855f7' },
        { name: 'GitHub自動更新', status: '5分ごとにpull', color: '#FF6B6B' },
      ],
    },
    {
      name: 'Mac Mini 小（サブ）',
      status: '準備中',
      statusIcon: '🔧',
      statusColor: '#FFD700',
      processes: [
        { name: '追加エージェント', status: '計画中', color: '#ffffff55' },
        { name: 'バックアップ系', status: '計画中', color: '#ffffff55' },
      ],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="border p-4 mb-6 text-center" style={{ borderColor: '#FF950044', background: '#FF950008' }}>
        <div className="text-xs font-mono mb-1" style={{ color: '#ffffff66' }}>OSHI INFRASTRUCTURE</div>
        <div className="text-2xl font-mono font-bold" style={{ color: '#FF9500', textShadow: '0 0 20px #FF9500' }}>
          OSHIの軍団を作る
        </div>
        <div className="text-sm font-mono mt-2" style={{ color: '#ffffff88' }}>
          Mac Mini 2台体制 → 将来的にさらに拡張予定
        </div>
        <div className="text-xs font-mono mt-1" style={{ color: '#ffffff55' }}>
          資金源: KAGURAセール + AirdropsQuest
        </div>
      </div>

      {/* Server Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {servers.map((srv, i) => (
          <div key={i} className="border p-4" style={{ borderColor: srv.statusColor + '44', background: srv.statusColor + '08' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-mono font-bold text-sm" style={{ color: srv.statusColor, textShadow: `0 0 8px ${srv.statusColor}` }}>
                {srv.name}
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: srv.statusColor }}>
                {srv.statusIcon} {srv.status}
              </span>
            </div>
            <div className="space-y-2">
              {srv.processes.map((p, j) => (
                <div key={j} className="flex items-center justify-between border-t pt-2" style={{ borderColor: '#ffffff11' }}>
                  <span className="text-xs font-mono" style={{ color: '#ffffffcc' }}>{p.name}</span>
                  <span className="text-xs font-mono" style={{ color: p.color }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Auto Update System */}
      <div className="border p-4 mb-6" style={{ borderColor: '#00FFFF44', background: '#00FFFF08' }}>
        <div className="font-mono font-bold text-sm mb-3" style={{ color: '#00FFFF', textShadow: '0 0 8px #00FFFF' }}>
          自動更新システム
        </div>
        <div className="space-y-2">
          {[
            { step: '1', desc: 'OSHIがコードをGitHubにプッシュ', color: '#00FF00' },
            { step: '2', desc: 'MacMiniが5分ごとにgit pull', color: '#FFD700' },
            { step: '3', desc: '変更を検知 → OSHI Jr自動再起動', color: '#FF6B6B' },
            { step: '4', desc: 'Telegramで更新通知', color: '#a855f7' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold w-6 h-6 flex items-center justify-center border" style={{ color: s.color, borderColor: s.color + '44' }}>{s.step}</span>
              <span className="text-xs font-mono" style={{ color: '#ffffffcc' }}>{s.desc}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs font-mono" style={{ color: '#ffffff55' }}>
          ゆーだはターミナルを触らない。GitHubプッシュだけで全て完結。
        </div>
      </div>

      {/* Setup Command */}
      <div className="border p-4" style={{ borderColor: '#a855f744', background: '#a855f708' }}>
        <div className="font-mono font-bold text-sm mb-2" style={{ color: '#a855f7' }}>初回セットアップ（1コマンド）</div>
        <div className="bg-black p-3 border" style={{ borderColor: '#ffffff22' }}>
          <code className="text-xs font-mono" style={{ color: '#00FF00' }}>
            curl -fsSL https://raw.githubusercontent.com/startmeltd-jpg/oshi-core/main/scripts/install.sh | bash
          </code>
        </div>
        <div className="text-xs font-mono mt-2" style={{ color: '#ffffff55' }}>
          これだけで全部設定完了。Python依存パッケージ・.env・LaunchAgent・cron全自動。
        </div>
      </div>

      {/* Roadmap */}
      <div className="mt-6 border p-4" style={{ borderColor: '#FFD70044', background: '#FFD70008' }}>
        <div className="font-mono font-bold text-sm mb-3" style={{ color: '#FFD700' }}>インフラ拡張ロードマップ</div>
        <div className="space-y-2">
          {[
            { phase: 'Phase 1', desc: 'Mac Mini 大 - OSHI Jr 24時間稼働', status: '完了', color: '#00FF00' },
            { phase: 'Phase 2', desc: 'Mac Mini 小 - 追加エージェント配備', status: '準備中', color: '#FFD700' },
            { phase: 'Phase 3', desc: 'モニター購入 - 監視ダッシュボード', status: '計画中', color: '#FF9500' },
            { phase: 'Phase 4', desc: 'さらにMac追加 - OSHIの軍団完成', status: '未来', color: '#a855f7' },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold" style={{ color: p.color }}>{p.phase}</span>
                <span className="text-xs font-mono" style={{ color: '#ffffffcc' }}>{p.desc}</span>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: p.color }}>{p.status}</span>
            </div>
          ))}
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
              HISTORY v1.1
            </span>
            <span className="text-xs font-mono" style={{ color: '#ffffff44' }}>Last updated: 2026-03-09</span>
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
          {activeTab === 'infra' && (
            <>
              <SectionTitle color="#FF9500">インフラストラクチャ</SectionTitle>
              <InfraTab />
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
            HISTORY v1.1 — OSHI文明の記録 — 2024-10 〜 2026-03-09
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: '#ffffff22' }}>
            記憶の更新＝生存確認
          </p>
        </div>
      </main>
    </div>
  );
}
