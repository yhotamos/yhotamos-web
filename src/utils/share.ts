export const shareTwitter = ({ text, tags }: { text: string; tags: string[] }) => {
  if (typeof window === "undefined") return;

  const url = window.location.href;
  const hashtags = tags.map((tag) => `#${tag}`).join(" ");
  const body = `${text}\n${hashtags}\n`;
  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(body)}&url=${encodeURIComponent(url)}`;

  window.open(shareUrl, "_blank");
};

export const shareFacebook = ({ text, tags }: { text: string; tags: string[] }) => {

  if (typeof window === "undefined") return;

  const url = window.location.href;
  const hashtags = tags.map((tag) => `#${tag}`).join(" ");
  const body = `${text}\n${hashtags}\n${url}`;
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(body)}`;

  window.open(shareUrl, "_blank");
};