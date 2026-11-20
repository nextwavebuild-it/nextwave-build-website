export type BlogDocument = {
  type: "doc";
  content: unknown[];
};

const ALLOWED_NODES = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "hardBreak",
  "horizontalRule",
  "codeBlock",
  "image",
]);

const ALLOWED_MARKS = new Set(["bold", "italic", "strike", "code", "link"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseBlogDocument(raw: string) {
  if (!raw || raw.length > 300000) {
    throw new Error("Invalid article content size.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Article content is not valid JSON.");
  }

  if (!isRecord(parsed) || parsed.type !== "doc") {
    throw new Error("Invalid article document.");
  }

  let characters = 0;
  let nodes = 0;

  function validate(value: unknown, depth: number): void {
    if (!isRecord(value) || depth > 30 || ++nodes > 10000) {
      throw new Error("Invalid or overly complex article.");
    }

    if (typeof value.type !== "string" || !ALLOWED_NODES.has(value.type)) {
      throw new Error("Unsupported article element.");
    }

    if (value.type === "text") {
      if (typeof value.text !== "string") {
        throw new Error("Invalid text element.");
      }

      characters += value.text.length;
    } else if (value.text !== undefined) {
      throw new Error("Unexpected text content.");
    }

    // Validate image attributes explicitly.
    if (value.type === "image" && !isRecord(value.attrs)) {
      throw new Error("Image attributes are required.");
    }

    if (value.attrs !== undefined) {
      if (!isRecord(value.attrs)) {
        throw new Error("Invalid element attributes.");
      }

      const keys = Object.keys(value.attrs);

      // IMAGE VALIDATION

      if (value.type === "image") {
        const attrs = value.attrs;

        const allowedImageAttributes = [
          "src",
          "alt",
          "title",
          "width",
          "height",
        ];

        if (
          keys.some((key) => !allowedImageAttributes.includes(key)) ||
          typeof attrs.src !== "string" ||
          typeof attrs.alt !== "string" ||
          !attrs.alt.trim() ||
          attrs.alt.length > 200 ||
          (attrs.title != null && typeof attrs.title !== "string")
        ) {
          throw new Error("Invalid article image.");
        }

        // Tiptap may include null dimensions.
        // Explicit dimensions must be valid pixel values.
        for (const dimension of ["width", "height"]) {
          const size = attrs[dimension];

          if (
            size != null &&
            (typeof size !== "number" ||
              !Number.isInteger(size) ||
              size < 1 ||
              size > 10000)
          ) {
            throw new Error("Invalid article image dimensions.");
          }
        }

        if (attrs.src.length > 2048) {
          throw new Error("Article image URL is too long.");
        }

        try {
          const url = new URL(attrs.src);

          if (url.protocol !== "https:" || url.username || url.password) {
            throw new Error("Unsafe article image URL.");
          }
        } catch {
          throw new Error("Invalid article image URL.");
        }
      }

      // HEADING VALIDATION
      if (
        value.type === "heading" &&
        (keys.some((key) => key !== "level") ||
          ![2, 3].includes(Number(value.attrs.level)))
      ) {
        throw new Error("Invalid heading.");
      }

      // REJECT UNEXPECTED ATTRIBUTES
      if (
        !["heading", "orderedList", "listItem", "image"].includes(value.type) &&
        keys.length > 0
      ) {
        throw new Error("Unsupported element attributes.");
      }

      if (
        ["orderedList", "listItem"].includes(value.type) &&
        keys.some((key) => !["start", "data", "bullet", "type"].includes(key))
      ) {
        throw new Error("Unsupported list attributes.");
      }
    }

    // VALIDATE TEXT FORMATTING
    if (value.marks !== undefined) {
      if (value.type !== "text" || !Array.isArray(value.marks)) {
        throw new Error("Invalid text marks.");
      }

      for (const mark of value.marks) {
        if (
          !isRecord(mark) ||
          typeof mark.type !== "string" ||
          !ALLOWED_MARKS.has(mark.type)
        ) {
          throw new Error("Unsupported formatting.");
        }

        if (mark.type === "link") {
          if (!isRecord(mark.attrs) || typeof mark.attrs.href !== "string") {
            throw new Error("Invalid hyperlink.");
          }

          try {
            const url = new URL(mark.attrs.href);

            if (!["http:", "https:"].includes(url.protocol)) {
              throw new Error("Unsafe link.");
            }
          } catch {
            throw new Error("Invalid hyperlink URL.");
          }
        } else if (
          mark.attrs !== undefined &&
          isRecord(mark.attrs) &&
          Object.keys(mark.attrs).length > 0
        ) {
          throw new Error("Unexpected mark attributes.");
        }
      }
    }

    // VALIDATE NESTED CONTENT
    if (value.content !== undefined) {
      if (!Array.isArray(value.content)) {
        throw new Error("Invalid nested article content.");
      }

      if (value.type === "image" && value.content.length > 0) {
        throw new Error("Image elements cannot contain nested content.");
      }

      value.content.forEach((child) => validate(child, depth + 1));
    }
  }

  validate(parsed, 0);

  if (characters < 50 || characters > 150000) {
    throw new Error("Article body must contain 50–150,000 text characters.");
  }

  return {
    format: "tiptap_v1" as const,
    doc: parsed as BlogDocument,
  };
}
