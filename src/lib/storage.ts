import "server-only";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { uploadToCloudinary, type CloudinaryConfig } from "@/lib/cloudinary-core";

/**
 * Stockage des images.
 * - Développement local : disque local (UPLOAD_DIR), servi par /api/files/[name].
 * - Production : Cloudinary (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET), servi par son CDN.
 */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

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
  const cloudinary = getCloudinaryConfig();
  if (cloudinary) return uploadToCloudinary(cloudinary, file, "image");

  if (process.env.VERCEL) {
    throw new Error("Cloudinary n'est pas configuré (variables CLOUDINARY_* manquantes).");
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
  const cloudinary = getCloudinaryConfig();
  if (cloudinary) return uploadToCloudinary(cloudinary, file, "video");

  if (process.env.VERCEL) {
    throw new Error("Cloudinary n'est pas configuré (variables CLOUDINARY_* manquantes).");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/api/files/${name}`;
}
