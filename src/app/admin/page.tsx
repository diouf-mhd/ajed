import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

const QUICK = [
  { href: "/admin/actions/new", label: "+ Ajouter une action" },
  { href: "/admin/actualites/new", label: "+ Ajouter une actualité" },
  { href: "/admin/galerie", label: "+ Ajouter des photos" },
  { href: "/admin/evenements/new", label: "+ Ajouter un événement" },
];

export default async function Dashboard() {
  const [actions, photos, news, events, lastA, lastN, lastE, lastP] = await Promise.all([
    db.action.count(), db.photo.count(), db.news.count(), db.event.count(),
    db.action.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    db.news.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    db.event.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    db.photo.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    ["Actions", actions], ["Photos", photos], ["Actualités", news], ["Événements", events],
  ] as const;

  const activity = [
    ...lastA.map((x) => ({ at: x.updatedAt, text: `Action : ${x.title}`, href: `/admin/actions/${x.id}` })),
    ...lastN.map((x) => ({ at: x.updatedAt, text: `Actualité : ${x.title}`, href: `/admin/actualites/${x.id}` })),
    ...lastE.map((x) => ({ at: x.updatedAt, text: `Événement : ${x.title}`, href: `/admin/evenements/${x.id}` })),
    ...lastP.map((x) => ({ at: x.createdAt, text: `Photo ajoutée${x.title ? ` : ${x.title}` : ""}`, href: "/admin/galerie" })),
  ].sort((a, b) => +b.at - +a.at).slice(0, 8);

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-extrabold text-forest">Bonjour 👋</h1>
      <p className="mt-1 text-lg text-ink/70">Bienvenue dans l&apos;administration AJED.</p>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([label, n]) => (
          <div key={label} className="rounded-2xl bg-white p-5 ring-1 ring-black/10">
            <dd className="font-display text-4xl font-extrabold text-forest">{n}</dd>
            <dt className="text-ink/70">{label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        {QUICK.map((q) => <Link key={q.href} href={q.href} className="btn-sun !py-2.5">{q.label}</Link>)}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-forest">Dernières activités</h2>
        {activity.length === 0 ? (
          <p className="mt-3 text-ink/70">Rien pour l&apos;instant : commencez par ajouter une action.</p>
        ) : (
          <ul className="mt-3 divide-y divide-black/10 rounded-2xl bg-white ring-1 ring-black/10">
            {activity.map((a, i) => (
              <li key={i}>
                <Link href={a.href} className="flex justify-between gap-4 p-4 hover:bg-chalk">
                  <span>{a.text}</span><span className="shrink-0 text-sm text-ink/60">{formatDate(a.at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
