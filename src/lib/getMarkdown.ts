export const getMarkdown = async (url: string) => {
  const response = await fetch(url);
  const markdown = await response.text();

  return markdown;
};
