"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const MAX_VIDEO_BYTES = 40 * 1024 * 1024;

export function VideoUploadField({ current, directUploads }: { current?: string | null; directUploads: boolean }) {
  const [url, setUrl] = useState(current ?? "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadVideo(file?: File) {
    if (!file) return;
    const extension = VIDEO_TYPES[file.type];
    if (!extension) {
      setError("Format non pris en charge. Choisissez MP4, WebM ou MOV.");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError("La vidéo dépasse la limite de 40 Mo.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError("");
    try {
      const blob = await upload(`ajed/${crypto.randomUUID()}.${extension}`, file, {
        access: "public",
        contentType: file.type,
        handleUploadUrl: "/api/blob",
        multipart: file.size > 5 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      setUrl(blob.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Échec de l'envoi de la vidéo.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  if (!directUploads) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold" htmlFor="videoUrl">Lien vidéo</label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          defaultValue={current ?? ""}
          placeholder="https://…"
          className="input"
        />
        <label className="block text-sm font-semibold">
          Téléverser une vidéo
          <input name="videoFile" type="file" accept="video/mp4,video/webm,video/quicktime" className="mt-2 block w-full text-sm font-normal" />
        </label>
        <p className="text-xs text-ink/60">MP4, WebM ou MOV · 40 Mo maximum. Le fichier sera envoyé avec l’action.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold" htmlFor="videoUrl">Lien vidéo</label>
      <input
        id="videoUrl"
        name="videoUrl"
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://… ou téléversez une vidéo"
        className="input"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="btn-line cursor-pointer !px-4 !py-2 text-sm">
          {uploading ? `Envoi… ${progress}%` : url ? "Remplacer la vidéo" : "Téléverser une vidéo"}
          <input
            ref={fileInput}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => void uploadVideo(event.currentTarget.files?.[0])}
          />
        </label>
        <span className="text-xs text-ink/60">MP4, WebM ou MOV · 40 Mo maximum</span>
      </div>
      {uploading && <progress value={progress} max={100} aria-label="Progression de l'envoi" className="h-2 w-full accent-forest" />}
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}
