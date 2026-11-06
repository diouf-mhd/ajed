import { createHash } from "crypto";

/**
 * Fonctions Cloudinary pures (aucune lecture de variable d'environnement),
 * partagées entre l'application et le script de migration.
 */
export type CloudinaryConfig = { cloudName: string; apiKey: string; apiSecret: string };
export type ResourceType = "image" | "video";

export const CLOUDINARY_FOLDER = "ajed";
export const ALLOWED_FORMATS: Record<ResourceType, string> = {
  image: "jpg,jpeg,png,webp,gif",
  video: "mp4,webm,mov",
};
// Les photos sont réduites à l'arrivée : 2000 px max, qualité automatique.
export const IMAGE_INCOMING_TRANSFORMATION = "c_limit,w_2000,h_2000,q_auto:good";

type Params = Record<string, string | number>;

export function signParams(params: Params, apiSecret: string) {
  const toSign = Object.entries(params)
    .filter(([, value]) => value !== "" && value != null)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/** Paramètres signés d'un upload (utilisés côté serveur ET renvoyés au navigateur). */
export function buildUploadParams(resourceType: ResourceType, apiSecret: string) {
  const params: Params = {
    allowed_formats: ALLOWED_FORMATS[resourceType],
    folder: CLOUDINARY_FOLDER,
    timestamp: Math.round(Date.now() / 1000),
    ...(resourceType === "image" ? { transformation: IMAGE_INCOMING_TRANSFORMATION } : {}),
  };
  return { params, signature: signParams(params, apiSecret) };
}

/** Envoie un fichier (Blob) ou une URL distante à Cloudinary et renvoie l'URL https finale. */
export async function uploadToCloudinary(
  config: CloudinaryConfig,
  source: Blob | string,
  resourceType: ResourceType,
): Promise<string> {
  const { params, signature } = buildUploadParams(resourceType, config.apiSecret);
  const form = new FormData();
  form.set("file", source);
  form.set("api_key", config.apiKey);
  form.set("signature", signature);
  for (const [key, value] of Object.entries(params)) form.set(key, String(value));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: form,
  });
  const data = (await response.json().catch(() => ({}))) as { secure_url?: string; error?: { message?: string } };
  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message ?? `Échec de l'envoi vers Cloudinary (${response.status}).`);
  }
  return data.secure_url;
}
