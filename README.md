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

lint は公式の推奨ルールを使用する．警告も含めて確認する場合は `npm run lint -- --max-warnings=0` を実行する．

Vercel へ反映する前に Preview で主要ページと外部データの読み取りを確認する．
