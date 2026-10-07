import Link from "next/link";
import { PageHeader, StatusBadge } from "@/components/admin/fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminNews() {
  const news = await db.news.findMany({ orderBy: { date: "desc" } });
  return (
    <div className="max-w-4xl">
      <PageHeader title="Actualités"><Link href="/admin/actualites/new" className="btn-sun !py-2.5">+ Ajouter une actualité</Link></PageHeader>
      {news.length === 0 && <p className="text-ink/70">Aucune actualité.</p>}
      <ul className="divide-y divide-black/10 rounded-2xl bg-white ring-1 ring-black/10">
        {news.map((n) => (
          <li key={n.id}>
            <Link href={`/admin/actualites/${n.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-chalk">
              <span><span className="font-semibold">{n.title}</span><br /><span className="text-sm text-ink/60">{formatDate(n.date)}</span></span>
              <StatusBadge status={n.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
