import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { CodeBlock } from "./codeBlock";
import styles from "./markdown.module.css";

type MarkdownProps = {
  content: string;
  headingPrefix?: string;
  top?: number;
  components?: Components;
  codeTheme?: "dark" | "adaptive";
};

export function Markdown({ content, headingPrefix = "", top, components, codeTheme = "dark" }: MarkdownProps) {
  const markdownComponents: Components = {
    pre: ({ children, className }) => <CodeBlock className={className} codeTheme={codeTheme}>{children}</CodeBlock>,
    h1: createHeading("h1", headingPrefix, top),
    h2: createHeading("h2", headingPrefix, top),
    h3: createHeading("h3", headingPrefix, top),
  };

  if (headingPrefix) {
    markdownComponents.a = ({ href, children, title, target, rel }) => {
      let link = href;
      if (href?.startsWith("#")) link = `#${headingPrefix}-${href.slice(1)}`;
      return <a href={link} title={title} target={target} rel={rel}>{children}</a>;
    };
  }

  return (
    <div className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeHighlight, { aliases: { ini: ["env", "dotenv"] } }]]}
        components={{ ...markdownComponents, ...components }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const createHeading = (Tag: "h1" | "h2" | "h3", headingPrefix: string, top?: number) => {
  return function MarkdownHeading({ children }: ComponentPropsWithoutRef<"h1">) {
    const text = String(children);
    const id = text
      .toLowerCase()
      .replace(/[^\w一-龠ぁ-んァ-ンー]/g, "")
      .replace(/\s+/g, "-");
    const headingId = headingPrefix ? `${headingPrefix}-${id}` : id;
    return <Tag id={headingId} style={{ scrollMarginTop: top }}>{children}</Tag>;
  };
};
