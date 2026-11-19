"use client";

import { useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, Upload, X } from "lucide-react";

import { createBlogBrowserClient } from "@/lib/blog-supabase/client";

type Props = {
  initialUrl?: string | null;
};

const BUCKET = "blog-images";
const MAX_SIZE = 2 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export default function FeaturedImageUploader({ initialUrl = null }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function uploadImage(file: File) {
    setError("");
    setSuccess("");

    const extension = MIME_EXTENSIONS[file.type];

    if (!extension) {
      setError("Only WebP, JPEG and PNG images are allowed.");
      return;
    }

    if (file.size === 0 || file.size > MAX_SIZE) {
      setError("Image must be smaller than or equal to 2 MB.");
      return;
    }

    setUploading(true);

    try {
      const supabase = createBlogBrowserClient();

      const { data: auth, error: authError } = await supabase.auth.getUser();

      if (authError || !auth.user) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const filePath = `featured/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error(
          "Image uploaded but its public URL could not be created.",
        );
      }

      setImageUrl(data.publicUrl);
      setSuccess("Image uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Image upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void uploadImage(file);
    }

    event.target.value = "";
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="featured_image" value={imageUrl} readOnly />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/webp,image/jpeg,image/png"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
        aria-label="Select featured image"
      />

      {imageUrl ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1c2022]">
            {/* Supabase public image URL */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Featured image preview"
              className="aspect-video w-full object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#D5FF66] px-4 py-2.5 text-sm font-semibold !text-[#101214] hover:bg-[#C5EF53] disabled:opacity-50"
            >
              <Upload size={16} />
              Replace Image
            </button>

            <button
              type="button"
              disabled={uploading}
              onClick={() => {
                setImageUrl("");
                setError("");
                setSuccess("");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#24292B] px-4 py-2.5 text-sm text-white hover:border-red-400/50 hover:text-red-300 disabled:opacity-50"
            >
              <X size={16} />
              Remove from Article
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/20 bg-[#1c2022] p-8 text-center">
          <ImagePlus size={36} className="mx-auto mb-4 text-[#D5FF66]" />

          <h3 className="font-semibold text-white">Upload Featured Image</h3>

          <p className="mt-2 text-sm text-white/45">
            Recommended: 1200 × 630 px, optimized WebP. Maximum 2 MB.
          </p>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214] hover:bg-[#C5EF53] disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Choose Image
              </>
            )}
          </button>
        </div>
      )}

      {uploading && (
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-white/60"
        >
          <Loader2 size={16} className="animate-spin" />
          Uploading to Supabase Storage...
        </div>
      )}

      {success && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-[#D5FF66]"
        >
          <CheckCircle2 size={16} />
          {success}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <p className="text-xs text-white/40">
        Uploading or replacing an image does not delete the old file from
        Storage. Save the article to apply the change.
      </p>
    </div>
  );
}
