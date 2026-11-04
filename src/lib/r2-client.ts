"use client";

export async function uploadMediaToR2(file: File, onProgress?: (percentage: number) => void): Promise<string> {
  const response = await fetch("/api/r2-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });
  const payload = (await response.json()) as { uploadUrl?: string; publicUrl?: string; error?: string };
  if (!response.ok || !payload.uploadUrl || !payload.publicUrl) {
    throw new Error(payload.error ?? "Impossible de préparer l’envoi du fichier.");
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", payload.uploadUrl!);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve(payload.publicUrl!);
      else reject(new Error(`Échec de l’envoi vers R2 (${request.status}).`));
    };
    request.onerror = () => reject(new Error("Impossible de joindre le stockage R2. Vérifiez la règle CORS du bucket."));
    request.onabort = () => reject(new Error("Envoi vers R2 annulé."));
    request.send(file);
  });
}
