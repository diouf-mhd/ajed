import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/auth";

const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Authentification requise.");
        if (!pathname.startsWith("ajed/")) throw new Error("Chemin de fichier invalide.");
        return {
          allowedContentTypes: imageTypes,
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
          cacheControlMaxAge: 31536000,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Échec de l'upload.";
    return Response.json({ error: message }, { status: 400 });
  }
}
