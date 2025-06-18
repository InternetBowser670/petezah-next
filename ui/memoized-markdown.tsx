import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content, className }: { content: string; className?: string }) => {
    return (
      <div className={`${className}`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({
    content,
    id,
    className,
  }: {
    content: string;
    id: string;
    className?: string;
  }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock
        className={`${className ?? ""} my-2!`}
        content={block}
        key={`${id}-block_${index}`}
      />
    ));
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
