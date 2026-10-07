import { DeleteButton } from "@/components/admin/ui";
import { PageHeader } from "@/components/admin/fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { deleteApplication } from "../server-actions";

export default async function AdminApplications() {
  const items = await db.application.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="max-w-3xl">
      <PageHeader title="Candidatures et messages" />
      {items.length === 0 && <p className="text-ink/70">Aucun message pour le moment.</p>}
      <ul className="space-y-4">
        {items.map((a) => (
          <li key={a.id} className="rounded-2xl bg-white p-5 ring-1 ring-black/10">
            <p className="font-semibold">{a.name} <span className="font-normal text-ink/60">· {formatDate(a.createdAt)}</span></p>
            <p className="text-sm text-leaf">{[a.phone, a.email].filter(Boolean).join(" · ")}</p>
            <p className="mt-2 whitespace-pre-line">{a.message}</p>
            <form action={deleteApplication} className="mt-3"><input type="hidden" name="id" value={a.id} /><DeleteButton /></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
