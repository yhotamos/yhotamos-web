export type SiteFeedbackType = "typo" | "impression" | "other";
export type ToolFeedbackType = "bug" | "suggestion" | "impression" | "other";

export type FeedbackEntry = {
  type: SiteFeedbackType;
  title: string;
  detail: string;
  contact?: string;
};

export type IssueEntry = {
  toolName: string;
  type: ToolFeedbackType;
  title: string;
  detail: string;
  contact?: string;
  browser?: string;
  bugType?: string;
  attachmentName?: string;
  attachmentData?: string;
  attachmentMimeType?: string;
};

export type ProductInfo = {
  repo_name: string;
  name: string;
  icon_url: string;
  category: string;
};
