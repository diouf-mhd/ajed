import type { Action, BeforeAfter } from "@prisma/client";
import { Field, ImageField, Select, STATUS_OPTIONS, TextArea } from "./fields";
import { DeleteButton, SubmitButton } from "./ui";
import { CATEGORIES, toInputDate } from "@/lib/utils";
import { deleteAction, deleteBeforeAfter, saveAction } from "@/app/admin/server-actions";

export function ActionForm({ action }: { action?: (Action & { beforeAfter: BeforeAfter | null }) | null }) {
  return (
    <>
      <form action={saveAction} className="max-w-3xl space-y-5 rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-8">
        {action && <input type="hidden" name="id" value={action.id} />}
        <Field label="Titre" name="title" required defaultValue={action?.title} />
        <Field label="Adresse (slug)" name="slug" defaultValue={action?.slug} hint="Laissez vide pour la générer depuis le titre." />
        <TextArea label="Courte description (carrousel et cartes)" name="summary" rows={2} required defaultValue={action?.summary} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Date" name="date" type="date" required defaultValue={toInputDate(action?.date)} />
          <Field label="Heure" name="time" placeholder="09h00" defaultValue={action?.time ?? ""} />
          <Field label="Participants" name="participants" type="number" min={0} defaultValue={action?.participants ?? ""} />
        </div>
        <Field label="Lieu" name="location" required defaultValue={action?.location} />
        <TextArea label="Description" name="description" rows={6} required defaultValue={action?.description} />
        <TextArea label="Objectifs" name="objectives" defaultValue={action?.objectives ?? ""} />
        <TextArea label="Résultats" name="results" defaultValue={action?.results ?? ""} />
        <Field label="Lien vidéo (facultatif)" name="videoUrl" type="url" defaultValue={action?.videoUrl ?? ""} />

        <ImageField label="Image principale" name="cover" keepName="coverImage" current={action?.coverImage} />

        <fieldset className="space-y-3 rounded-2xl bg-chalk p-4">
          <legend className="px-2 text-sm font-bold">Photos de l&apos;action</legend>
          <input type="file" name="photos" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="block w-full text-sm" />
          <Select label="Catégorie de ces photos" name="photoCategory" options={[...CATEGORIES]} defaultValue="NETTOYAGE" />
          <p className="text-xs text-ink/60">Les photos ajoutées apparaissent aussi dans la galerie (gérez-les ensuite dans « Galerie »).</p>
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl bg-chalk p-4">
          <legend className="px-2 text-sm font-bold">Avant / Après</legend>
          <ImageField label="Image AVANT" name="before" keepName="beforeUrl" current={action?.beforeAfter?.beforeUrl} />
          <ImageField label="Image APRÈS" name="after" keepName="afterUrl" current={action?.beforeAfter?.afterUrl} />
          <Field label="Légende" name="baCaption" defaultValue={action?.beforeAfter?.caption ?? ""} />
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Statut" name="status" options={STATUS_OPTIONS} defaultValue={action?.status ?? "DRAFT"} />
          <label className="flex items-center gap-3 pt-6 text-sm font-semibold">
            <input type="checkbox" name="featured" defaultChecked={action?.featured} className="h-5 w-5 accent-forest" />
            Mettre en avant dans « Réalisations »
          </label>
        </div>

        <SubmitButton>{action ? "Enregistrer" : "Créer l'action"}</SubmitButton>
      </form>

      {action && (
        <div className="mt-6 flex flex-wrap gap-3">
          {action.beforeAfter && (
            <form action={deleteBeforeAfter}>
              <input type="hidden" name="actionId" value={action.id} />
              <DeleteButton label="Retirer l'avant/après" confirmText="Retirer le comparatif avant/après ?" />
            </form>
          )}
          <form action={deleteAction}>
            <input type="hidden" name="id" value={action.id} />
            <DeleteButton label="Supprimer l'action" confirmText="Supprimer cette action et ses photos ?" />
          </form>
        </div>
      )}
    </>
  );
}
