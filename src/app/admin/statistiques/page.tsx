import { DeleteButton, SubmitButton } from "@/components/admin/ui";
import { Field, PageHeader } from "@/components/admin/fields";
import { db } from "@/lib/db";
import { addStat, deleteStat, saveStats } from "../server-actions";

export default async function AdminStats() {
  const stats = await db.statistic.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="max-w-3xl">
      <PageHeader title="Réalisations & statistiques" />
      <p className="mb-6 text-ink/70">Ces chiffres s&apos;affichent, animés, dans la section « Nos réalisations » de l&apos;accueil.</p>

      <form action={saveStats} className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-black/10">
        {stats.length === 0 && <p className="text-ink/70">Aucune statistique.</p>}
        {stats.map((s) => (
          <div key={s.id} className="grid grid-cols-[1fr_6rem_5rem_4rem] items-end gap-3">
            <Field label="Intitulé" name={`label_${s.id}`} defaultValue={s.label} />
            <Field label="Valeur" name={`value_${s.id}`} type="number" min={0} defaultValue={s.value} />
            <Field label="Suffixe" name={`suffix_${s.id}`} placeholder="+" defaultValue={s.suffix} />
            <Field label="Ordre" name={`order_${s.id}`} type="number" defaultValue={s.order} />
          </div>
        ))}
        {stats.length > 0 && <SubmitButton>Enregistrer les chiffres</SubmitButton>}
      </form>

      <h2 className="mt-10 text-xl font-bold text-forest">Ajouter un chiffre</h2>
      <form action={addStat} className="mt-3 grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:grid-cols-[1fr_7rem_5rem_auto] sm:items-end">
        <Field label="Intitulé" name="label" required />
        <Field label="Valeur" name="value" type="number" min={0} defaultValue={0} />
        <Field label="Suffixe" name="suffix" placeholder="+" />
        <SubmitButton>Ajouter</SubmitButton>
      </form>

      {stats.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {stats.map((s) => (
            <form key={s.id} action={deleteStat}><input type="hidden" name="id" value={s.id} /><DeleteButton label={`Supprimer « ${s.label} »`} /></form>
          ))}
        </div>
      )}
    </div>
  );
}
