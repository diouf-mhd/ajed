import type { News } from "@prisma/client";
import { Field, ImageField, Select, STATUS_OPTIONS, TextArea } from "./fields";
import { DeleteButton, SubmitButton } from "./ui";
import { toInputDate } from "@/lib/utils";
import { deleteNews, saveNews } from "@/app/admin/server-actions";

export function NewsForm({ news }: { news?: News | null }) {
  return (
    <>
      <form action={saveNews} className="max-w-3xl space-y-5 rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-8">
        {news && <input type="hidden" name="id" value={news.id} />}
        <Field label="Titre" name="title" required defaultValue={news?.title} />
        <TextArea label="Résumé" name="summary" rows={2} required defaultValue={news?.summary} />
        <TextArea label="Contenu complet" name="content" rows={10} required defaultValue={news?.content} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" name="date" type="date" required defaultValue={toInputDate(news?.date ?? new Date())} />
          <Select label="Statut" name="status" options={STATUS_OPTIONS} defaultValue={news?.status ?? "DRAFT"} />
        </div>
        <details className="rounded-xl bg-chalk p-4">
          <summary className="cursor-pointer font-semibold text-forest">Options complémentaires</summary>
          <div className="mt-4 space-y-5">
            <Field label="Adresse (slug)" name="slug" defaultValue={news?.slug} hint="Laissez vide pour la générer depuis le titre." />
            <ImageField label="Image" name="imageFile" keepName="image" current={news?.image} />
          </div>
        </details>
        <SubmitButton>{news ? "Enregistrer" : "Créer l'actualité"}</SubmitButton>
      </form>
      {news && (
        <form action={deleteNews} className="mt-6"><input type="hidden" name="id" value={news.id} /><DeleteButton label="Supprimer l'actualité" /></form>
      )}
    </>
  );
}
