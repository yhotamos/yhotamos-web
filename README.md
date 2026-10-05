# YHOTAMOS

自作ツール・Chrome 拡張機能・技術ブログをまとめた個人開発サイト．

## 技術構成

- Next.js 16.3.8（App Router／Turbopack）
- React／React DOM 19.3.0
- TypeScript 6.0.3
- Tailwind CSS v4
- ESLint 9.39.5／typescript-eslint 8.71.0

製品・記事情報と投稿の保存には Google Sheets，プロジェクト情報には Notion，リポジトリ・Issue には GitHub，メール通知には Resend を利用する．各サービスの認証情報は `.env.local` に設定する．

## 開発

```sh
npm ci
npm run dev
```

http://localhost:3000 で確認できる．ブログ本文は `content/blog`，変更履歴は `content/changelog` に置く．

## 検証と本番起動

型・lint・ビルドの順に検証する．

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

`typecheck` は Next.js のルート型を生成してから `tsc --noEmit` を実行する．`build` はブログ索引を生成してから本番ビルドを行う．Google Fonts と外部データの取得にはネットワーク接続が必要である．

依存更新時の広範な書き換えを避けるため，既存の `any` 型，指定した箇所の Effect 内の状態同期と見出しコンポーネントの表示名は lint の警告として残している．

Vercel へ反映する前に Preview で主要ページと外部データの読み取りを確認する．
