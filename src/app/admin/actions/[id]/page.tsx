import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import { PageHeader } from "@/components/admin/fields";
import { db } from "@/lib/db";

export default async function EditAction({ params }: { params: Promise<{ id: string }> }) {
  const action = await db.action.findUnique({ where: { id: (await params).id }, include: { beforeAfter: true } });
  if (!action) notFound();
  return (<><PageHeader title="Modifier l'action" /><ActionForm action={action} /></>);
}
