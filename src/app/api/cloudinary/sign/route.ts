import { isAdmin } from "@/lib/auth";
import { buildUploadParams, type ResourceType } from "@/lib/cloudinary-core";
import { getCloudinaryConfig } from "@/lib/storage";

/** Signature d'upload pour le navigateur — réservé à l'administrateur connecté. */
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Authentification requise." }, { status: 401 });
  const config = getCloudinaryConfig();
  if (!config) return Response.json({ error: "Cloudinary n'est pas configuré." }, { status: 500 });

  const body = (await request.json().catch(() => ({}))) as { resourceType?: string };
  const resourceType: ResourceType = body.resourceType === "video" ? "video" : "image";
  const { params, signature } = buildUploadParams(resourceType, config.apiSecret);
  return Response.json({ cloudName: config.cloudName, apiKey: config.apiKey, params, signature });
}
