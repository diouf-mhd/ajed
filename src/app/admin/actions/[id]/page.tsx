import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import { PageHeader } from "@/components/admin/fields";
import { db } from "@/lib/db";

export default async function EditAction({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const [action, editions, quartiers] = await Promise.all([
    db.action.findUnique({ where: { id }, include: { beforeAfter: true, quartiers: true } }),
    db.edition.findMany({ orderBy: { number: "desc" } }),
    db.quartier.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!action) notFound();
  return (<><PageHeader title="Modifier l'action" /><ActionForm action={action} editions={editions} quartiers={quartiers} /></>);
}
