import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/fields";
import { db } from "@/lib/db";
import { isR2Configured } from "@/lib/r2";

export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  const event = await db.event.findUnique({ where: { id: (await params).id } });
  if (!event) notFound();
  return (<><PageHeader title="Modifier l'événement" /><EventForm event={event} directUploads={isR2Configured()} /></>);
}
