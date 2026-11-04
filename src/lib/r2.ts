import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

const required = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
] as const;

export function isR2Configured() {
  return required.every((key) => Boolean(process.env[key]));
}

export function getR2Client() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Configuration R2 incomplète : ${missing.join(", ")}.`);
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export function getR2PublicUrl(key: string) {
  const baseUrl = process.env.R2_PUBLIC_URL;
  if (!baseUrl) throw new Error("La variable R2_PUBLIC_URL n’est pas configurée.");
  return `${baseUrl.replace(/\/+$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export function getR2Bucket() {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("La variable R2_BUCKET_NAME n’est pas configurée.");
  return bucket;
}
