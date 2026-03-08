import { useState } from 'react';
import { Link } from 'wouter';

const ERROR_RULE_TEXT = `【エラー時の技術変更禁止ルール】

エラーが発生した場合、以下のルールを厳守すること：

1. 技術スタックの変更禁止
   - フレームワーク、ライブラリ、言語の変更は絶対に行わない
   - 「別の方法で試す」は禁止
   - 既存の技術スタック内で解決する

2. エラーの原因を特定してから修正する
   - エラーメッセージを正確に読む
   - スタックトレースを確認する
   - 変更した箇所を特定する
   - 原因不明のまま修正しない

3. 最小限の変更で修正する
   - 1つのエラーに対して1つの修正
   - 関係ない箇所を変更しない
   - 「ついでに」の修正は禁止

4. 修正前にバックアップを取る
   - git commitしてから修正する
   - 修正がうまくいかなければrevertする

5. 動作確認してからcommitする
   - ビルドが通ることを確認
   - 画面が正常に表示されることを確認
   - 既存機能が壊れていないことを確認`;

export default function Knowledge() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ERROR_RULE_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid rgba(0, 255, 0, 0.2)',
          paddingBottom: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Link href="/">
          <span
            style={{
              color: '#00FF00',
              cursor: 'pointer',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textShadow: '0 0 20px #00FF00',
            }}
          >
            ◉ OSHI
          </span>
        </Link>
        <span style={{ color: '#00FFFF', fontSize: '1.2rem' }}>
          / Knowledge Base
        </span>
      </header>

      {/* Title */}
      <h1
        style={{
          color: '#FFD700',
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
        }}
      >
        Knowledge — ナレッジベース
      </h1>

      <p
        style={{
          color: '#00FFFF',
          marginBottom: '2rem',
          fontSize: '1rem',
          lineHeight: '1.8',
        }}
      >
        チーム全員が守るべきルールと知識をここに集約。
        エラー対応時は必ず以下のルールをManusに貼り付けてください。
      </p>

      {/* Error Rule Copy Box */}
      <div
        style={{
          border: '1px solid #FF0000',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 0, 0, 0.05)',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2
            style={{
              color: '#FF0000',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
            }}
          >
            エラー時の技術変更禁止ルール
          </h2>
          <button
            onClick={handleCopy}
            style={{
              color: copied ? '#00FF00' : '#FF0000',
              border: `1px solid ${copied ? '#00FF00' : '#FF0000'}`,
              borderRadius: '6px',
              padding: '8px 16px',
              backgroundColor: copied
                ? 'rgba(0, 255, 0, 0.1)'
                : 'rgba(255, 0, 0, 0.1)',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.3s',
            }}
          >
            {copied ? 'コピー完了!' : 'コピーする'}
          </button>
        </div>

        <pre
          style={{
            color: '#e0e0e0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '1.5rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'auto',
            border: '1px solid rgba(255, 0, 0, 0.2)',
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {ERROR_RULE_TEXT}
        </pre>
      </div>

      {/* Additional Knowledge Sections */}
      <div
        style={{
          border: '1px solid rgba(0, 255, 0, 0.3)',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: 'rgba(0, 255, 0, 0.02)',
        }}
      >
        <h2
          style={{
            color: '#00FF00',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}
        >
          その他のナレッジ
        </h2>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>Coming Soon</p>
      </div>
    </div>
  );
}
