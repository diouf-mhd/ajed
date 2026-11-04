import { DeleteButton } from "@/components/admin/ui";
import { PageHeader } from "@/components/admin/fields";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { db } from "@/lib/db";
import { categoryLabel } from "@/lib/utils";
import { deletePhoto } from "./../server-actions";

export default async function AdminGallery() {
  const [photos, actions, quartiers] = await Promise.all([
    db.photo.findMany({ orderBy: { createdAt: "desc" }, include: { action: { select: { title: true } }, quartier: true }, take: 200 }),
    db.action.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
    db.quartier.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="max-w-5xl">
      <PageHeader title="Galerie" />
      <GalleryUploadForm actions={actions} quartiers={quartiers} directUploads={Boolean(process.env.VERCEL)} />

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p) => (
          <li key={p.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.title ?? ""} loading="lazy" className="aspect-square w-full object-cover" />
            <div className="space-y-2 p-3 text-sm">
              <p className="truncate font-semibold">{p.title ?? p.action?.title ?? "Sans titre"}</p>
              <p className="text-ink/60">{categoryLabel(p.category)}{p.quartier ? ` · ${p.quartier.name}` : ""}</p>
              <form action={deletePhoto}><input type="hidden" name="id" value={p.id} /><DeleteButton confirmText="Supprimer cette photo ?" /></form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
