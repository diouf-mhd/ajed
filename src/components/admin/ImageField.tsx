"use client";

import { useState } from "react";
import { uploadMediaToR2 } from "@/lib/r2-client";

export function ImageField({
  label,
  name,
  keepName,
  current,
  directUploads,
}: {
  label: string;
  name: string;
  keepName: string;
  current?: string | null;
  directUploads: boolean;
}) {
  const [url, setUrl] = useState(current ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(file?: File) {
    if (!file || !directUploads) return;
    setError("");
    setUploading(true);
    try {
      setUrl(await uploadMediaToR2(file));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Échec de l’envoi de l’image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="text-sm font-semibold">
      <p>{label}</p>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-2 h-28 w-auto rounded-xl object-cover" />
      )}
      <input type="hidden" name={keepName} value={url} readOnly />
      <input
        type="file"
        name={directUploads ? undefined : name}
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={uploading}
        onChange={directUploads ? (event) => void handleUpload(event.currentTarget.files?.[0]) : undefined}
        className="mt-2 block w-full text-sm font-normal file:mr-3 file:rounded-full file:border-0 file:bg-sun file:px-4 file:py-2 file:font-semibold"
      />
      {uploading && <p role="status" className="mt-2 text-xs text-ink/60">Envoi de l’image…</p>}
      {error && <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
