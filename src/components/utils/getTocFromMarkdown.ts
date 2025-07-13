import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

export type TocItem = {
  text: string;
  id: string;
  depth: number;
};

export function getTocFromMarkdown(markdown: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(markdown);

  const toc: TocItem[] = [];

  visit(tree, "heading", (node: any) => {
    const text = node.children
      .filter((child: any) => child.type === "text")
      .map((child: any) => child.value)
      .join("");

    const id = text
      .toLowerCase()
      .replace(/[^\w一-龠ぁ-んァ-ンー]/g, "")
      .replace(/\s+/g, "-");

    toc.push({
      text,
      id,
      depth: node.depth,
    });
  });

  return toc;
}
