// src/components/Markdown.tsx
"use client";

import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark-dimmed.css"; // style cho code

// TS của v10 không export type cho code như bản cũ.
// Khai báo props tối thiểu để dùng được 'inline'.
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  node?: unknown;
}

const Code = ({ inline, className, children, ...props }: CodeProps) => {
  if (inline) {
    return (
      <code className={`px-1 py-0.5 rounded ${className ?? ""}`} {...props}>
        {children}
      </code>
    );
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const mdComponents: Components = {
  a({ node, ...props }) {
    return <a {...props} target="_blank" rel="noopener noreferrer" />;
  },
  img({ node, ...props }) {
    return <img {...props} className="rounded-xl" />;
  },
  pre({ node, ...props }) {
    return <pre {...props} className="overflow-x-auto rounded-lg" />;
  },
  // ép kiểu về Components['code'] để hợp TS v10
  code: Code as unknown as Components["code"],
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeHighlight,
        ]}
        components={mdComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
