import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ExamMarkdownProps {
  content: string;
}

export function ExamMarkdown({ content }: ExamMarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        code({ children, ...props }) {
          return (
            <code
              className="rounded-lg bg-[var(--surface)] px-1.5 py-1 font-mono text-[0.92em] text-[var(--accent-strong)]"
              {...props}
            >
              {children}
            </code>
          );
        },
        li({ children }) {
          return <li className="ml-5 list-disc">{children}</li>;
        },
        p({ children }) {
          return <Fragment>{children}</Fragment>;
        },
      }}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  );
}
