export const shareX = ({ text, tags }: { text: string; tags: string[] }) => {
  if (typeof window === "undefined") return;

  const url = window.location.href;
  const hashtags = tags.map((tag) => `#${tag}`).join(" ");
  const body = `${text}\n${hashtags}\n`;
  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(body)}&url=${encodeURIComponent(url)}`;

  window.open(shareUrl, "_blank");
};

export const shareHatena = () => {
  if (typeof window === "undefined") return;

  const url = window.location.href;
  const shareUrl = `https://b.hatena.ne.jp/entry/${encodeURIComponent(url)}`;

  window.open(shareUrl, "_blank", "noopener,noreferrer");
};
