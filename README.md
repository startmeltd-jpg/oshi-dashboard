# oshi-dashboard

**OSHI文明のリアルタイムダッシュボード** — エージェント状態・記憶数・タスク進捗・IP管理を一覧表示する。

## デプロイ先

| 環境 | URL | ホスティング |
|---|---|---|
| 本番 | [oshilabs.xyz](https://oshilabs.xyz) | GitHub Pages |
| 開発 | localhost:5000 | Vite dev server |

## data.json

ダッシュボードの全データは `data.json` で管理される。主要フィールド:

- `status`: タスク進捗、現在のタスク
- `agents`: エージェント名簿（6体）
- `memory`: 記憶数（rules/knowledge/trivia）
- `uptime`: 稼働日数（Day 1 = 2026-01-01）
- `projects`: IP一覧
- `activityLog`: 直近のアクティビティ
- `evolution`: 進化指標
- `impact`: 影響指標

## 開発

```bash
pnpm install
pnpm dev       # 開発サーバー起動
pnpm build     # ビルド
```

## 最終更新

**Day 62**（2026-03-03）— data.json全面更新（エージェント名簿修正、実データ同期）
