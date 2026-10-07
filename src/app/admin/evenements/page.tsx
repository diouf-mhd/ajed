import Link from "next/link";
import { PageHeader, StatusBadge } from "@/components/admin/fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminEvents() {
  const events = await db.event.findMany({ orderBy: { date: "desc" } });
  return (
    <div className="max-w-4xl">
      <PageHeader title="Événements"><Link href="/admin/evenements/new" className="btn-sun !py-2.5">+ Ajouter un événement</Link></PageHeader>
      {events.length === 0 && <p className="text-ink/70">Aucun événement.</p>}
      <ul className="divide-y divide-black/10 rounded-2xl bg-white ring-1 ring-black/10">
        {events.map((e) => (
          <li key={e.id}>
            <Link href={`/admin/evenements/${e.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-chalk">
              <span><span className="font-semibold">{e.title}</span><br /><span className="text-sm text-ink/60">{formatDate(e.date)} · {e.location}</span></span>
              <StatusBadge status={e.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
