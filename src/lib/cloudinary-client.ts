"use client";

import type { ResourceType } from "@/lib/cloudinary-core";

/** Upload direct navigateur → Cloudinary (contourne la limite de taille des requêtes Vercel). */
export async function uploadDirect(file: File, resourceType: ResourceType, onProgress?: (percent: number) => void): Promise<string> {
  const signResponse = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceType }),
  });
  const signed = await signResponse.json();
  if (!signResponse.ok) throw new Error(signed.error ?? "Autorisation d'envoi refusée.");

  const form = new FormData();
  form.set("file", file);
  form.set("api_key", signed.apiKey);
  form.set("signature", signed.signature);
  for (const [key, value] of Object.entries(signed.params as Record<string, string | number>)) form.set(key, String(value));

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onerror = () => reject(new Error("Connexion perdue pendant l'envoi."));
    xhr.onload = () => {
      let data: { secure_url?: string; error?: { message?: string } } = {};
      try { data = JSON.parse(xhr.responseText); } catch { /* réponse non JSON */ }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) resolve(data.secure_url);
      else reject(new Error(data.error?.message ?? `Échec de l'envoi (${xhr.status}).`));
    };
    xhr.send(form);
  });
}
