import { SupportItem } from "../types/support";

export const supportItems: SupportItem[] = [
  { title: "FAQ", href: "/support/faq", description: "よくある質問と回答を参照できます．", enabled: false },
  { title: "フィードバック", href: "/support/feedback", description: "改善提案や不具合報告を送信してください．", enabled: true },
  { title: "寄付・支援", href: "/support/donate", description: "開発継続を支える支援方法を案内します．", enabled: false },
  { title: "お問い合わせ", href: "/support/contact", description: "個別の連絡や依頼はこちら．", enabled: true },
];
