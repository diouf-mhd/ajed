import { DropZone, DeleteButton, SubmitButton } from "@/components/admin/ui";
import { Field, PageHeader, Select } from "@/components/admin/fields";
import { db } from "@/lib/db";
import { CATEGORIES, categoryLabel, toInputDate } from "@/lib/utils";
import { deletePhoto, uploadPhotos } from "./../server-actions";

export default async function AdminGallery() {
  const [photos, actions] = await Promise.all([
    db.photo.findMany({ orderBy: { createdAt: "desc" }, include: { action: { select: { title: true } } }, take: 200 }),
    db.action.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
  ]);

  return (
    <div className="max-w-5xl">
      <PageHeader title="Galerie" />
      <form action={uploadPhotos} className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-black/10">
        <DropZone />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Catégorie" name="category" options={[...CATEGORIES]} />
          <Select label="Action associée" name="actionId" options={[{ value: "", label: "Aucune" }, ...actions.map((a) => ({ value: a.id, label: a.title }))]} />
          <Field label="Date" name="date" type="date" defaultValue={toInputDate(new Date())} />
          <Field label="Titre (facultatif, si une seule photo)" name="title" />
        </div>
        <SubmitButton>Envoyer les photos</SubmitButton>
      </form>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p) => (
          <li key={p.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.title ?? ""} loading="lazy" className="aspect-square w-full object-cover" />
            <div className="space-y-2 p-3 text-sm">
              <p className="truncate font-semibold">{p.title ?? p.action?.title ?? "Sans titre"}</p>
              <p className="text-ink/60">{categoryLabel(p.category)}</p>
              <form action={deletePhoto}><input type="hidden" name="id" value={p.id} /><DeleteButton confirmText="Supprimer cette photo ?" /></form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
