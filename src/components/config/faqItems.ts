import { FAQItem } from '@/components/types/support';

export const faqItems: FAQItem[] = [
  {
    id: 'getting-started',
    question: 'ツールの導入手順はありますか？',
    answer: '公式ドキュメントの「はじめに」セクションを参照してください．インストールは `npm install <package>` で可能です．',
    category: 'general',
    tags: ['install', 'npm'],
    updatedAt: '2025-07-10'
  },
  {
    id: 'troubleshoot-cache',
    question: 'ビルド後に表示が更新されません．',
    answer: 'ブラウザキャッシュかCDNキャッシュが原因の可能性があります．ハードリロードまたはキャッシュ無効化ヘッダを確認してください．',
    category: 'troubleshoot',
    tags: ['cache', 'deploy'],
    updatedAt: '2025-07-15'
  },
  {
    id: 'donation-methods',
    question: '寄付の方法は何がありますか？',
    answer: '現在は GitHub Sponsors，Ko-fi，Buy Me a Coffee に対応予定です．ページ内のボタンから任意のプラットフォームを選択できます．',
    category: 'donation',
    tags: ['support'],
    updatedAt: '2025-07-12'
  }
];