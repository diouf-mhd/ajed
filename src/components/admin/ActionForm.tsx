import type { Action, BeforeAfter, Edition, Quartier } from "@prisma/client";
import { Field, ImageField, Select, STATUS_OPTIONS, TextArea } from "./fields";
import { DeleteButton, SubmitButton } from "./ui";
import { CATEGORIES, toInputDate } from "@/lib/utils";
import { deleteAction, deleteBeforeAfter, saveAction } from "@/app/admin/server-actions";

type FormAction = Action & { beforeAfter: BeforeAfter | null; quartiers: Quartier[] };

export function ActionForm({ action, editions, quartiers }: { action?: FormAction | null; editions: Edition[]; quartiers: Quartier[] }) {
  return (
    <>
      <form action={saveAction} className="max-w-3xl space-y-5 rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-8">
        {action && <input type="hidden" name="id" value={action.id} />}
        <Field label="Titre" name="title" required defaultValue={action?.title} />
        <TextArea label="Courte description (carrousel et cartes)" name="summary" rows={2} required defaultValue={action?.summary} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" name="date" type="date" required defaultValue={toInputDate(action?.date)} />
          <Field label="Lieu" name="location" required defaultValue={action?.location} />
        </div>
        <details open={Boolean(action?.quartiers.length)} className="rounded-xl bg-chalk p-4">
          <summary className="cursor-pointer font-semibold text-forest">Édition et quartiers</summary>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Édition" name="editionId" options={[{ value: "", label: "Aucune" }, ...editions.map((edition) => ({ value: edition.id, label: edition.title }))]} defaultValue={action?.editionId ?? ""} />
              <Field label="Numéro de la journée" name="dayNumber" type="number" min={1} defaultValue={action?.dayNumber ?? ""} />
            </div>
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold">Quartier(s) concerné(s)</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {quartiers.map((quartier) => (
                  <label key={quartier.id} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm">
                    <input type="checkbox" name="quartierIds" value={quartier.id} defaultChecked={action?.quartiers.some((item) => item.id === quartier.id)} className="h-4 w-4 accent-forest" />
                    {quartier.name}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </details>
        <details className="rounded-xl bg-chalk p-4">
          <summary className="cursor-pointer font-semibold text-forest">Détails complémentaires (facultatif)</summary>
          <div className="mt-4 space-y-5">
            <Field label="Heure" name="time" placeholder="09h00" defaultValue={action?.time ?? ""} />
            <Field label="Adresse (slug)" name="slug" defaultValue={action?.slug} hint="Laissez vide pour la générer depuis le titre." />
            <Field label="Participants" name="participants" type="number" min={0} defaultValue={action?.participants ?? ""} />
            <TextArea label="Description détaillée (facultatif)" name="description" rows={5} defaultValue={action?.description} />
            <TextArea label="Objectifs" name="objectives" defaultValue={action?.objectives ?? ""} />
            <TextArea label="Résultats" name="results" defaultValue={action?.results ?? ""} />
            <Field label="Lien vidéo" name="videoUrl" type="url" defaultValue={action?.videoUrl ?? ""} />
            <ImageField label="Image principale" name="cover" keepName="coverImage" current={action?.coverImage} />
            <ImageField label="Affiche d'annonce" name="posterFile" keepName="poster" current={action?.poster} />
            <fieldset className="space-y-3 rounded-xl bg-white p-4">
              <legend className="px-2 text-sm font-bold">Photos de l&apos;action</legend>
              <input type="file" name="photos" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="block w-full text-sm" />
              <Select label="Catégorie" name="photoCategory" options={[...CATEGORIES]} defaultValue="NETTOYAGE" />
              <Select label="Quartier associé (facultatif)" name="photoQuartierId" options={[{ value: "", label: "Tous les quartiers de cette journée" }, ...quartiers.map((quartier) => ({ value: quartier.id, label: quartier.name }))]} />
            </fieldset>
            <fieldset className="space-y-3 rounded-xl bg-white p-4">
              <legend className="px-2 text-sm font-bold">Avant / Après</legend>
              <ImageField label="Image AVANT" name="before" keepName="beforeUrl" current={action?.beforeAfter?.beforeUrl} />
              <ImageField label="Image APRÈS" name="after" keepName="afterUrl" current={action?.beforeAfter?.afterUrl} />
              <Field label="Légende" name="baCaption" defaultValue={action?.beforeAfter?.caption ?? ""} />
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Statut" name="status" options={STATUS_OPTIONS} defaultValue={action?.status ?? "DRAFT"} />
              <label className="flex items-center gap-3 text-sm font-semibold">
                <input type="checkbox" name="featured" defaultChecked={action?.featured} className="h-5 w-5 accent-forest" />
                Mettre en avant dans « Réalisations »
              </label>
            </div>
          </div>
        </details>

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
