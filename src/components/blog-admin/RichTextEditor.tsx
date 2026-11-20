"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

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
  ImagePlus,
  Loader2,
} from "lucide-react";

import { createBlogBrowserClient } from "@/lib/blog-supabase/client";

type StoredContent = {
  format?: string;
  text?: string;
  doc?: JSONContent;
} | null;

type Props = {
  initialContent?: StoredContent;
};

const IMAGE_BUCKET = "blog-images";
const IMAGE_FOLDER = "content";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
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
          content: [
            {
              type: "text",
              text: line,
            },
          ],
        })),
    };
  }

  return {
    type: "doc",
    content: [{ type: "paragraph" }],
  };
}

export default function RichTextEditor({ initialContent }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadPositionRef = useRef<number | null>(null);

  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

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

      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "my-6 h-auto max-w-full rounded-xl object-contain",
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

  // --------------------------------
  // INSERT / UPDATE LINK
  // --------------------------------
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

      editor
        .chain()
        .focus()
        .setLink({
          href: parsed.href,
        })
        .run();
    } catch {
      window.alert("Enter a valid URL, such as https://example.com");
    }
  }

  // --------------------------------
  // OPEN IMAGE UPLOAD PICKER
  // --------------------------------
  function openImagePicker() {
    if (!editor || uploading) return;

    setUploadError("");

    // Preserve the insertion point while the
    // file picker and upload are open.
    uploadPositionRef.current = editor.state.selection.from;

    fileInputRef.current?.click();
  }

  // --------------------------------
  // UPLOAD IMAGE TO SUPABASE
  // --------------------------------
  async function uploadArticleImage(file: File) {
    if (!editor || uploading) return;

    setUploadError("");

    const extension = MIME_EXTENSIONS[file.type];

    if (!extension) {
      setUploadError("Only WebP, JPEG and PNG images are allowed.");
      return;
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      setUploadError(
        "Image must be greater than 0 bytes and no larger than 2 MB.",
      );
      return;
    }

    setUploading(true);

    try {
      const supabase = createBlogBrowserClient();

      // Confirm the current CMS user is signed in.
      const { data: auth, error: authError } = await supabase.auth.getUser();

      if (authError || !auth.user) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const filePath = `${IMAGE_FOLDER}/${fileName}`;

      // Upload into the existing blog-images bucket.
      const { error: storageError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) {
        throw new Error(storageError.message);
      }

      const { data: publicData } = supabase.storage
        .from(IMAGE_BUCKET)
        .getPublicUrl(filePath);

      if (!publicData.publicUrl) {
        throw new Error(
          "Image was uploaded but a public URL could not be generated.",
        );
      }

      // Insert at the original cursor position.
      const maxPosition = editor.state.doc.content.size;

      const position = Math.max(
        0,
        Math.min(
          uploadPositionRef.current ?? editor.state.selection.from,
          maxPosition,
        ),
      );

      const altText =
        file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim()
          .slice(0, 200) || "Article image";

      const inserted = editor
        .chain()
        .focus()
        .setTextSelection(position)
        .setImage({
          src: publicData.publicUrl,
          alt: altText,
        })
        .run();

      if (!inserted) {
        throw new Error(
          "Image uploaded, but insertion failed. Please try again.",
        );
      }
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Image upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      uploadPositionRef.current = null;
    }
  }

  // --------------------------------
  // HANDLE FILE SELECTION
  // --------------------------------
  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again.
    event.target.value = "";

    if (file) {
      void uploadArticleImage(file);
    } else {
      uploadPositionRef.current = null;
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
      {/* ARTICLE JSON FOR SERVER ACTION */}
      <input type="hidden" name="body" value={content} readOnly />

      {/* HIDDEN FILE PICKER */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/webp,image/jpeg,image/png"
        onChange={handleImageChange}
        disabled={uploading}
        className="hidden"
        aria-label="Upload image into article"
      />

      {/* TOOLBAR */}
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
          className={btn(
            editor.isActive("heading", {
              level: 2,
            }),
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          <Heading2 size={18} />
        </button>

        <button
          type="button"
          title="Heading 3"
          aria-label="Heading 3"
          className={btn(
            editor.isActive("heading", {
              level: 3,
            }),
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
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

        {/* IMAGE UPLOAD BUTTON */}
        <button
          type="button"
          title="Upload image"
          aria-label="Upload image"
          className={btn()}
          onClick={openImagePicker}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ImagePlus size={18} />
          )}
        </button>

        <div className="mx-1 h-6 w-px bg-white/15" />

        <button
          type="button"
          title="Undo"
          aria-label="Undo"
          className={btn()}
          disabled={!editor.can().undo() || uploading}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={17} />
        </button>

        <button
          type="button"
          title="Redo"
          aria-label="Redo"
          className={btn()}
          disabled={!editor.can().redo() || uploading}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={17} />
        </button>
      </div>

      {/* EDITOR CONTENT */}
      <EditorContent editor={editor} />

      {/* UPLOAD STATUS */}
      {uploading && (
        <div
          role="status"
          className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-sm text-[#D5FF66]"
        >
          <Loader2 size={16} className="animate-spin" />
          Uploading image to Supabase Storage...
        </div>
      )}

      {/* UPLOAD ERROR */}
      {uploadError && (
        <div
          role="alert"
          className="border-t border-red-500/20 bg-red-950/20 px-4 py-3 text-sm text-red-300"
        >
          {uploadError}
        </div>
      )}

      {/* EDITOR FOOTER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2 text-xs text-white/45">
        <span>Use H2 and H3 for article section headings.</span>

        <span>
          {uploading ? "Image uploading..." : "Rich text · Image upload"}
        </span>
      </div>
    </div>
  );
}
