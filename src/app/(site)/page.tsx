import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ActionsCarousel } from "@/components/site/ActionsCarousel";
import { ActionCard } from "@/components/site/ActionCard";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { StatsCounter } from "@/components/site/StatsCounter";
import { Gallery } from "@/components/site/Gallery";
import { NewsCard } from "@/components/site/NewsCard";
import { JoinSection } from "@/components/site/JoinSection";
import { ContactInfo } from "@/components/site/ContactInfo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getBeforeAfters, getEditions, getFeaturedActions, getLatestActions, getNews, getPhotos, getQuartiers, getSettings, getStats, getUpcomingEvents } from "@/lib/data";
import { formatDate, isUpcoming } from "@/lib/utils";

const MISSION = [
  { emoji: "🌱", title: "Environnement", text: "Nettoyer, planter, sensibiliser : rendre Dougar plus propre, un quartier après l'autre.", cls: "bg-forest text-white" },
  { emoji: "🤝", title: "Engagement communautaire", text: "Des actions ouvertes à tous les habitants, pour que Dougar se prenne en main ensemble.", cls: "bg-sun text-ink" },
  { emoji: "👥", title: "Jeunesse", text: "Mobiliser les jeunes, leur donner confiance et une place dans le développement local.", cls: "bg-chalk text-forest" },
  { emoji: "💡", title: "Innovation", text: "Tester des idées neuves pour améliorer durablement le cadre de vie.", cls: "bg-ink text-white" },
];

export default async function HomePage() {
  const [latest, cards, beforeAfters, stats, featured, photos, news, events, settings, editions, quartiers] = await Promise.all([
    getLatestActions(5),
    getLatestActions(6),
    getBeforeAfters(3),
    getStats(),
    getFeaturedActions(3),
    getPhotos({ take: 8 }),
    getNews(3),
    getUpcomingEvents(3),
    getSettings(),
    getEditions(),
    getQuartiers(),
  ]);

  const slides = latest.map((a) => ({
    slug: a.slug, title: a.title, date: formatDate(a.date), time: a.time, location: a.location, summary: a.summary,
    image: isUpcoming(a.date) ? a.poster ?? a.coverImage : a.coverImage,
  }));
  const heroImage = settings.heroImage;
  const editionActions = editions[0]?.actions.slice().sort((a, b) => {
    const aUpcoming = isUpcoming(a.date);
    const bUpcoming = isUpcoming(b.date);
    if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
    return aUpcoming ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime();
  });

  return (
    <>
      <Hero image={heroImage} />

      <section aria-label="Dernières actions" className="relative z-10 -mt-24 sm:-mt-32">
        <div className="wrap"><ActionsCarousel slides={slides} /></div>
      </section>

      {editions[0] && editionActions && (
        <section id="edition" className="section bg-chalk">
          <div className="wrap">
            <SectionTitle title={`${editions[0].title} à Dougar`} intro="Une édition, plusieurs journées, des quartiers mobilisés." />
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {editionActions.map((action) => {
                const upcoming = isUpcoming(action.date);
                return (
                  <li key={action.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
                    {upcoming && action.poster && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={action.poster} alt={`Affiche : ${action.title}`} className="aspect-[4/3] w-full object-cover" />
                    )}
                    <div className="p-6">
                      <p className="text-sm font-bold uppercase text-leaf">Journée {action.dayNumber ?? ""} · {upcoming ? "À venir" : "Terminée"}</p>
                      <h3 className="mt-2 text-xl font-bold text-forest">{action.title}</h3>
                      <p className="mt-2 text-sm text-ink/70">{formatDate(action.date)} · {action.quartiers.map((quartier) => quartier.name).join(", ") || action.location}</p>
                      <Link href={`/actions/${action.slug}`} className="btn-line mt-5 !px-4 !py-2 text-sm">Détails</Link>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><h3 className="text-2xl font-bold text-forest">Les quartiers de Dougar</h3><p className="mt-1 text-ink/70">Suivez les journées organisées dans chaque quartier.</p></div>
                <Link href="/quartiers" className="btn-forest">Voir les quartiers</Link>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {quartiers.map((quartier) => (
                  <li key={quartier.id}><Link href={`/quartiers/${quartier.slug}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-forest ring-1 ring-black/10 hover:ring-forest">
                    {quartier.name}<span className="text-xs text-ink/55">{quartier.status === "DONE" ? "Terminée" : quartier.status === "UPCOMING" ? "À venir" : "À suivre"}</span>
                  </Link></li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section id="mission" className="section">
        <div className="wrap">
          <SectionTitle title="Une jeunesse qui agit pour Dougar" intro="L'AJED réunit des jeunes décidés à améliorer concrètement le cadre de vie de leur ville." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {MISSION.map((m) => (
              <div key={m.title} className={`rounded-3xl p-8 ${m.cls}`}>
                <p className="text-4xl" aria-hidden>{m.emoji}</p>
                <h3 className="mt-4 text-2xl font-bold">{m.title}</h3>
                <p className="mt-2 max-w-sm opacity-85">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="actions" className="section bg-chalk">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle title="Nos dernières actions" />
            <Link href="/actions" className="btn-line">Voir toutes les actions</Link>
          </div>
          {cards.length === 0 ? (
            <p className="mt-10 text-ink/70">Aucune action publiée pour l&apos;instant.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((a) => <ActionCard key={a.id} {...a} coverImage={isUpcoming(a.date) ? a.poster ?? a.coverImage : a.coverImage} />)}
            </div>
          )}
        </div>
      </section>

      {beforeAfters.length > 0 && (
        <section id="avant-apres" className="section">
          <div className="wrap">
            <SectionTitle title="Avant, après : Dougar se transforme" intro="Glissez le curseur pour voir la différence que nos actions ont faite." />
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {beforeAfters.map((b) => (
                <BeforeAfter key={b.id} before={b.beforeUrl} after={b.afterUrl} caption={b.caption || b.action.title} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="realisations" className="section bg-forest text-white">
        <div className="wrap">
          <SectionTitle light title="Nos réalisations" intro="Des chiffres qui montrent ce que la jeunesse de Dougar peut accomplir." />
          <div className="mt-12"><StatsCounter stats={stats} /></div>
          {featured.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((a) => <ActionCard key={a.id} {...a} />)}
            </div>
          )}
        </div>
      </section>

      {photos.length > 0 && (
        <section id="galerie" className="section">
          <div className="wrap">
            <SectionTitle title="En images" intro="Les moments forts de nos actions." />
            <div className="mt-10">
              <Gallery showFilters={false} photos={photos.map((p) => ({ id: p.id, url: p.url, title: p.title, category: p.category, actionTitle: p.action?.title ?? null }))} />
            </div>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="section bg-chalk">
          <div className="wrap">
            <SectionTitle title="Prochains rendez-vous" />
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {events.map((e) => (
                <li key={e.id} className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
                  <p className="font-semibold text-leaf">{formatDate(e.date)}{e.time ? ` · ${e.time}` : ""}</p>
                  <h3 className="mt-2 text-xl font-bold text-forest">{e.title}</h3>
                  <p className="mt-1 text-ink/70">{e.location}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section id="actualites" className="section">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle title="Actualités" />
              <Link href="/actualites" className="btn-line">Toutes les actualités</Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {news.map((n) => <NewsCard key={n.id} {...n} />)}
            </div>
          </div>
        </section>
      )}

      <JoinSection />

      <section id="contact" className="section">
        <div className="wrap">
          <SectionTitle title="Nous contacter" intro="Une question, une idée, un partenariat ? Écrivez-nous." />
          <div className="mt-8"><ContactInfo s={settings} /></div>
        </div>
      </section>
    </>
  );
}
