import Link from "next/link";
import { PageHeader, StatusBadge } from "@/components/admin/fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminActions() {
  const actions = await db.action.findMany({ orderBy: { date: "desc" }, include: { _count: { select: { photos: true } } } });
  return (
    <div className="max-w-4xl">
      <PageHeader title="Actions"><Link href="/admin/actions/new" className="btn-sun !py-2.5">+ Ajouter une action</Link></PageHeader>
      {actions.length === 0 && <p className="text-ink/70">Aucune action. Créez la première.</p>}
      <ul className="divide-y divide-black/10 rounded-2xl bg-white ring-1 ring-black/10">
        {actions.map((a) => (
          <li key={a.id}>
            <Link href={`/admin/actions/${a.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-chalk">
              <span><span className="font-semibold">{a.title}</span><br /><span className="text-sm text-ink/60">{formatDate(a.date)} · {a.location} · {a._count.photos} photo(s)</span></span>
              <StatusBadge status={a.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
