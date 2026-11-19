"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Undo2,
  Redo2,
  Pilcrow,
  Unlink2,
} from "lucide-react";

type StoredContent = {
  format?: string;
  text?: string;
  doc?: JSONContent;
} | null;

type Props = {
  initialContent?: StoredContent;
};

function initialDocument(content?: StoredContent): JSONContent {
  if (content?.format === "tiptap_v1" && content.doc?.type === "doc") {
    return content.doc;
  }

  if (content?.format === "plain_text_v1" && content.text) {
    return {
      type: "doc",
      content: content.text
        .split(/\n+/)
        .filter(Boolean)
        .map((line) => ({
          type: "paragraph",
          content: [{ type: "text", text: line }],
        })),
    };
  }

  return {
    type: "doc",
    content: [{ type: "paragraph" }],
  };
}

export default function RichTextEditor({ initialContent }: Props) {
  const [content, setContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
    ],
    content: initialDocument(initialContent),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "blog-rich-editor min-h-[420px] px-5 py-5 text-sm leading-8 text-white outline-none",
        "aria-label": "Article content editor",
      },
    },
    onCreate: ({ editor }) => {
      setContent(JSON.stringify(editor.getJSON()));
    },
    onUpdate: ({ editor }) => {
      setContent(JSON.stringify(editor.getJSON()));
    },
  });

  const btn = (active = false) =>
    `blog-editor-toolbar-btn flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 transition-colors ${
      active
        ? "blog-editor-toolbar-btn-active"
        : "blog-editor-toolbar-btn-default"
    }`;

  function setLink() {
    if (!editor) return;

    const previous = editor.getAttributes("link").href as string | undefined;

    const url = window.prompt(
      "Enter a link (https://...)",
      previous ?? "https://",
    );

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    try {
      const parsed = new URL(url.trim());

      if (!["https:", "http:"].includes(parsed.protocol)) {
        window.alert("Only HTTP and HTTPS links are allowed.");
        return;
      }

      editor.chain().focus().setLink({ href: parsed.href }).run();
    } catch {
      window.alert("Enter a valid URL, such as https://example.com");
    }
  }

  if (!editor) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#1c2022] p-5 text-white/50">
        Loading article editor...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-[#1c2022] focus-within:border-[#D5FF66]/60">
      <input type="hidden" name="body" value={content} readOnly />

      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-[#15191A] p-3">
        <button
          type="button"
          title="Paragraph"
          aria-label="Paragraph"
          className={btn(editor.isActive("paragraph"))}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow size={17} />
        </button>

        <button
          type="button"
          title="Heading 2"
          aria-label="Heading 2"
          className={btn(editor.isActive("heading", { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={18} />
        </button>

        <button
          type="button"
          title="Heading 3"
          aria-label="Heading 3"
          className={btn(editor.isActive("heading", { level: 3 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={18} />
        </button>

        <div className="mx-1 h-6 w-px bg-white/15" />

        <button
          type="button"
          title="Bold"
          aria-label="Bold"
          className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </button>

        <button
          type="button"
          title="Italic"
          aria-label="Italic"
          className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </button>

        <button
          type="button"
          title="Strikethrough"
          aria-label="Strikethrough"
          className={btn(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={17} />
        </button>

        <div className="mx-1 h-6 w-px bg-white/15" />

        <button
          type="button"
          title="Bullet list"
          aria-label="Bullet list"
          className={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={17} />
        </button>

        <button
          type="button"
          title="Numbered list"
          aria-label="Numbered list"
          className={btn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={17} />
        </button>

        <button
          type="button"
          title="Blockquote"
          aria-label="Blockquote"
          className={btn(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={17} />
        </button>

        <div className="mx-1 h-6 w-px bg-white/15" />

        <button
          type="button"
          title="Insert link"
          aria-label="Insert link"
          className={btn(editor.isActive("link"))}
          onClick={setLink}
        >
          <Link2 size={17} />
        </button>

        <button
          type="button"
          title="Remove link"
          aria-label="Remove link"
          className={btn()}
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink2 size={17} />
        </button>

        <div className="mx-1 h-6 w-px bg-white/15" />

        <button
          type="button"
          title="Undo"
          aria-label="Undo"
          className={btn()}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={17} />
        </button>

        <button
          type="button"
          title="Redo"
          aria-label="Redo"
          className={btn()}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={17} />
        </button>
      </div>

      <EditorContent editor={editor} />

      <div className="flex justify-between border-t border-white/10 px-4 py-2 text-xs text-white/45">
        <span>Use H2 and H3 for article section headings.</span>
        <span>{editor.storage.characterCount ? "" : "Rich text"}</span>
      </div>
    </div>
  );
}
