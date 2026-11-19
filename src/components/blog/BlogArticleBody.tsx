import type { ReactNode } from "react";

type Node = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{
    type?: string;
    attrs?: Record<string, unknown>;
  }>;
  content?: Node[];
};

type StoredContent = {
  format?: string;
  text?: string;
  doc?: Node;
};

function safeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function renderNode(node: Node, key: number): ReactNode {
  const children = node.content?.map((child, index) =>
    renderNode(child, index),
  );

  switch (node.type) {
    case "doc":
      return <div key={key}>{children}</div>;

    case "heading": {
      const level = Number(node.attrs?.level);
      if (level === 2) return <h2 key={key}>{children}</h2>;
      if (level === 3) return <h3 key={key}>{children}</h3>;
      return null;
    }

    case "paragraph":
      return <p key={key}>{children}</p>;

    case "bulletList":
      return <ul key={key}>{children}</ul>;

    case "orderedList":
      return <ol key={key}>{children}</ol>;

    case "listItem":
      return <li key={key}>{children}</li>;

    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;

    case "hardBreak":
      return <br key={key} />;

    case "horizontalRule":
      return <hr key={key} />;

    case "codeBlock":
      return (
        <pre key={key}>
          <code>{node.content?.map((item) => item.text ?? "").join("")}</code>
        </pre>
      );

    case "text": {
      let result: ReactNode = node.text ?? "";

      for (const [index, mark] of (node.marks ?? []).entries()) {
        switch (mark.type) {
          case "bold":
            result = <strong key={index}>{result}</strong>;
            break;
          case "italic":
            result = <em key={index}>{result}</em>;
            break;
          case "strike":
            result = <s key={index}>{result}</s>;
            break;
          case "code":
            result = <code key={index}>{result}</code>;
            break;
          case "link": {
            const href = safeUrl(mark.attrs?.href);

            if (href) {
              result = (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result}
                </a>
              );
            }
            break;
          }
        }
      }

      return <span key={key}>{result}</span>;
    }

    default:
      return null;
  }
}

export default function BlogArticleBody({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") {
    return null;
  }

  const stored = content as StoredContent;

  if (stored.format === "plain_text_v1" && typeof stored.text === "string") {
    return (
      <div className="blog-article-body">
        {stored.text
          .split(/\r?\n\s*\r?\n/)
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </div>
    );
  }

  if (stored.format === "tiptap_v1" && stored.doc?.type === "doc") {
    return <div className="blog-article-body">{renderNode(stored.doc, 0)}</div>;
  }

  return null;
}
