/**
 * Ajoute l'optimisation automatique Cloudinary (format + qualité + largeur max) à l'URL d'une image.
 * Les autres URLs (anciennes images, liens externes) sont renvoyées telles quelles.
 */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export function optimizeImage<T extends string | null | undefined>(url: T, width = 1600): T {
  if (!url) return url;
  const match = CLOUDINARY_UPLOAD.exec(url);
  if (!match || match[2].startsWith("f_auto")) return url;
  return `${match[1]}f_auto,q_auto,c_limit,w_${width}/${match[2]}` as T;
}

export function isCloudinaryUrl(value: string, cloudName?: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") return false;
    return cloudName ? url.pathname.startsWith(`/${cloudName}/`) : true;
  } catch {
    return false;
  }
}
