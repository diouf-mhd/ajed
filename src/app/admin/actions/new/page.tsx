import { ActionForm } from "@/components/admin/ActionForm";
import { PageHeader } from "@/components/admin/fields";
import { db } from "@/lib/db";

export default async function NewAction() {
  const [editions, quartiers] = await Promise.all([
    db.edition.findMany({ orderBy: { number: "desc" } }),
    db.quartier.findMany({ orderBy: { order: "asc" } }),
  ]);
  return (<><PageHeader title="Nouvelle action" /><ActionForm editions={editions} quartiers={quartiers} directUploads={Boolean(process.env.VERCEL)} /></>);
}
