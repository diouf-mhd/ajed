import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isAdmin } from "@/lib/auth";
import { getR2Bucket, getR2Client, getR2PublicUrl, isR2Configured } from "@/lib/r2";

const MEDIA_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 40 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Authentification requise." }, { status: 401 });
  if (!isR2Configured()) return Response.json({ error: "Le stockage R2 n’est pas encore configuré." }, { status: 503 });

  let input: { contentType?: unknown; size?: unknown };
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const contentType = typeof input.contentType === "string" ? input.contentType : "";
  const size = typeof input.size === "number" ? input.size : 0;
  const extension = MEDIA_TYPES[contentType];
  if (!extension) return Response.json({ error: "Format de fichier non pris en charge." }, { status: 400 });
  const maxBytes = contentType.startsWith("video/") ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (!Number.isInteger(size) || size <= 0 || size > maxBytes) {
    return Response.json({ error: `Fichier invalide ou trop volumineux (maximum ${maxBytes / 1024 / 1024} Mo).` }, { status: 400 });
  }

  const key = `ajed/${randomUUID()}.${extension}`;
  const command = new PutObjectCommand({
    Bucket: getR2Bucket(),
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 60 });
  return Response.json({ uploadUrl, publicUrl: getR2PublicUrl(key) });
}
