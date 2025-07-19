export type FAQItem = {
  id: string;               // 一意ID
  question: string;         // 質問文
  answer: string;           // 回答（Markdown対応想定）
  category: string;         // カテゴリキー
  tags?: string[];          // 補助タグ
  updatedAt?: string;       // 最終更新日（ISO）
};