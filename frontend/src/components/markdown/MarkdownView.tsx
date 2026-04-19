import { Fragment, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { CodeBlock } from "@/components/markdown/CodeBlock";
import { Heading } from "@/components/markdown/Heading";
import { ProseImage } from "@/components/markdown/ProseImage";
import type { MarkdownHeading } from "@/lib/markdown/headings";
import { cn } from "@/lib/utils";

interface MarkdownViewProps {
  className?: string;
  headings: MarkdownHeading[];
  markdown: string;
}

function flattenNodeText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(flattenNodeText).join("");
  }

  if (children && typeof children === "object" && "props" in children) {
    const props = children.props as { children?: ReactNode };
    return flattenNodeText(props.children ?? "");
  }

  return "";
}

function createHeadingRenderer(
  headings: MarkdownHeading[],
  level: 1 | 2 | 3 | 4 | 5 | 6,
) {
  let nextIndex = 0;

  return function RenderHeading({ children }: { children?: ReactNode }) {
    const text = flattenNodeText(children ?? "");
    const matchedIndex = headings.findIndex(
      (heading, index) =>
        index >= nextIndex && heading.depth === level && heading.text === text,
    );
    const heading =
      matchedIndex >= 0
        ? headings[matchedIndex]
        : {
            depth: level,
            id: `section-${nextIndex + 1}`,
            text,
          };

    nextIndex = matchedIndex >= 0 ? matchedIndex + 1 : nextIndex + 1;

    return (
      <Heading id={heading.id} level={level}>
        {children}
      </Heading>
    );
  };
}

export function MarkdownView({
  className,
  headings,
  markdown,
}: MarkdownViewProps) {
  const components: Components = {
    code({ children, className, ...props }) {
      if (!className) {
        return (
          <code
            className="rounded-lg bg-[var(--surface-strong)] px-1.5 py-1 font-mono text-[0.92em] text-[var(--accent-strong)]"
            {...props}
          >
            {children}
          </code>
        );
      }

      return <CodeBlock className={className}>{children}</CodeBlock>;
    },
    h1: createHeadingRenderer(headings, 1),
    h2: createHeadingRenderer(headings, 2),
    h3: createHeadingRenderer(headings, 3),
    h4: createHeadingRenderer(headings, 4),
    h5: createHeadingRenderer(headings, 5),
    h6: createHeadingRenderer(headings, 6),
    img({ alt, src, title }) {
      return (
        <ProseImage
          alt={alt}
          src={typeof src === "string" ? src : undefined}
          title={title}
        />
      );
    },
    pre({ children }) {
      return <Fragment>{children}</Fragment>;
    },
    table({ children }) {
      return (
        <div className="my-8 overflow-x-auto rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)]">
          <table>{children}</table>
        </div>
      );
    },
  };

  return (
    <div className={cn("mrp-prose", className)}>
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
