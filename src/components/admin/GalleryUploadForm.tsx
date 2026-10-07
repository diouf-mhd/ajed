"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Field, Select } from "@/components/admin/fields";
import { DropZone, SubmitButton } from "@/components/admin/ui";
import { CATEGORIES, toInputDate } from "@/lib/utils";
import { saveUploadedPhotos, uploadPhotos } from "@/app/admin/server-actions";

export function GalleryUploadForm({ actions, quartiers, directUploads }: { actions: { id: string; title: string }[]; quartiers: { id: string; name: string }[]; directUploads: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!files.length || busy) return;

    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    const urls: string[] = [];

    try {
      for (const [index, file] of files.entries()) {
        setStatus(`Envoi ${index + 1}/${files.length} : ${file.name}`);
        const pathname = `ajed/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
        const blob = await upload(pathname, file, {
          access: "public",
          contentType: file.type,
          handleUploadUrl: "/api/blob",
          multipart: file.size > 5 * 1024 * 1024,
        });
        urls.push(blob.url);
      }

      setStatus("Enregistrement des photos…");
      await saveUploadedPhotos({
        urls,
        title: String(form.get("title") ?? ""),
        actionId: String(form.get("actionId") ?? ""),
        quartierId: String(form.get("quartierId") ?? ""),
        category: String(form.get("category") ?? "AUTRES"),
        date: String(form.get("date") ?? ""),
      });
      setFiles([]);
      if (input.current) input.current.value = "";
      setStatus("");
      router.refresh();
    } catch (cause) {
      setStatus("");
      setError(cause instanceof Error ? cause.message : "Impossible d'envoyer les photos.");
    } finally {
      setBusy(false);
    }
  }

  if (!directUploads) {
    return (
      <form action={uploadPhotos} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/10">
        <DropZone />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Catégorie" name="category" options={[...CATEGORIES]} />
          <Select label="Action associée" name="actionId" options={[{ value: "", label: "Aucune" }, ...actions.map((action) => ({ value: action.id, label: action.title }))]} />
          <Select label="Quartier associé (facultatif)" name="quartierId" options={[{ value: "", label: "Aucun" }, ...quartiers.map((quartier) => ({ value: quartier.id, label: quartier.name }))]} />
          <Field label="Date" name="date" type="date" defaultValue={toInputDate(new Date())} />
          <Field label="Titre (utilisé si une seule photo)" name="title" />
        </div>
        <SubmitButton>Envoyer les photos</SubmitButton>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/10">
      <div className="rounded-xl border-2 border-dashed border-black/25 bg-chalk p-6 text-center">
        <label className="cursor-pointer font-semibold text-forest">
          Sélectionner plusieurs photos
          <input
            ref={input}
            type="file"
            multiple
            required
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={busy}
            onChange={(event) => setFiles(Array.from(event.currentTarget.files ?? []))}
          />
        </label>
        <p className="mt-2 text-sm text-ink/65">JPG, PNG, WebP ou GIF · 10 Mo maximum par photo</p>
        {files.length > 0 && <p className="mt-2 text-sm font-medium">{files.length} photo(s) sélectionnée(s)</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Catégorie" name="category" options={[...CATEGORIES]} defaultValue="AUTRES" />
        <Select label="Action associée" name="actionId" options={[{ value: "", label: "Aucune" }, ...actions.map((action) => ({ value: action.id, label: action.title }))]} />
        <Select label="Quartier associé (facultatif)" name="quartierId" options={[{ value: "", label: "Aucun" }, ...quartiers.map((quartier) => ({ value: quartier.id, label: quartier.name }))]} />
        <Field label="Date" name="date" type="date" defaultValue={toInputDate(new Date())} />
        <Field label="Titre (utilisé si une seule photo)" name="title" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy || files.length === 0} className="btn-forest disabled:opacity-60">
          {busy ? "Envoi en cours…" : "Envoyer les photos"}
        </button>
        {status && <p role="status" className="text-sm text-ink/70">{status}</p>}
      </div>
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
    </form>
  );
}
