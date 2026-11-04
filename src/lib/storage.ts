import "server-only";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

/**
 * Stockage des images.
 * - Développement local : disque local (UPLOAD_DIR), servi par /api/files/[name].
 * - Vercel : Blob public, servi directement par son CDN.
 */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const VIDEO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 40 * 1024 * 1024;

export async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = EXT[file.type];
  if (!ext) throw new Error("Format non supporté : utilisez JPG, PNG, WebP ou GIF.");
  if (file.size > MAX_BYTES) throw new Error("Image trop lourde (10 Mo maximum).");

  const name = `${randomUUID()}.${ext}`;
  const hasBlobCredentials = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );

  if (hasBlobCredentials) {
    const blob = await put(`ajed/${name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      cacheControlMaxAge: 31536000,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("Le stockage des images Vercel Blob n'est pas connecté à ce projet.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/api/files/${name}`;
}

export async function saveVideo(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = VIDEO_EXT[file.type];
  if (!ext) throw new Error("Format non pris en charge : utilisez MP4, WebM ou MOV.");
  if (file.size > MAX_VIDEO_BYTES) throw new Error("Vidéo trop lourde (40 Mo maximum).");

  const name = `${randomUUID()}.${ext}`;
  const hasBlobCredentials = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );

  if (hasBlobCredentials) {
    const blob = await put(`ajed/${name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      cacheControlMaxAge: 31536000,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("Le stockage vidéo Vercel Blob n'est pas connecté à ce projet.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/api/files/${name}`;
}
