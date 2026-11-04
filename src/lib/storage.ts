import "server-only";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Bucket, getR2Client, getR2PublicUrl, isR2Configured } from "@/lib/r2";

/**
 * Stockage des images.
 * - Développement local : disque local (UPLOAD_DIR), servi par /api/files/[name].
 * - Production : Cloudflare R2, servi via l’URL publique du bucket.
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

async function saveToR2(name: string, file: File) {
  await getR2Client().send(new PutObjectCommand({
    Bucket: getR2Bucket(),
    Key: `ajed/${name}`,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return getR2PublicUrl(`ajed/${name}`);
}

export async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = EXT[file.type];
  if (!ext) throw new Error("Format non supporté : utilisez JPG, PNG, WebP ou GIF.");
  if (file.size > MAX_BYTES) throw new Error("Image trop lourde (10 Mo maximum).");

  const name = `${randomUUID()}.${ext}`;
  if (isR2Configured()) return saveToR2(name, file);
  if (process.env.VERCEL) throw new Error("Le stockage Cloudflare R2 n’est pas configuré sur ce déploiement.");

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
  if (isR2Configured()) return saveToR2(name, file);
  if (process.env.VERCEL) throw new Error("Le stockage Cloudflare R2 n’est pas configuré sur ce déploiement.");

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/api/files/${name}`;
}
