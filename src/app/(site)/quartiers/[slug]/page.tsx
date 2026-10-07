import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Gallery } from "@/components/site/Gallery";
import { Img } from "@/components/ui/Img";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getQuartier } from "@/lib/data";
import { formatDate, isUpcoming } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const quartier = await getQuartier((await params).slug);
  return quartier ? { title: quartier.name, description: `Journées et photos de l'AJED à ${quartier.name}.` } : {};
}

export default async function QuartierPage({ params }: Props) {
  const quartier = await getQuartier((await params).slug);
  if (!quartier) notFound();

  const unassignedPhotos = quartier.photos.filter((photo) => !quartier.actions.some((action) => action.id === photo.actionId));

  return (
    <div className="wrap section">
      <Link href="/quartiers" className="text-sm font-semibold text-leaf hover:text-forest">← Tous les quartiers</Link>
      <div className="mt-5"><SectionTitle title={quartier.name} intro="Les journées de l'AJED dans ce quartier." /></div>
      {quartier.actions.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-chalk p-6 text-ink/70">Aucune journée publiée pour le moment.</p>
      ) : (
        <ol className="mt-10 space-y-8">
          {quartier.actions.map((action) => {
            const upcoming = isUpcoming(action.date);
            const photos = quartier.photos.filter((photo) => photo.actionId === action.id);
            return (
              <li key={action.id} className="border-t border-black/10 pt-8">
                <article>
                  {upcoming && action.poster && <Img src={action.poster} alt={`Affiche : ${action.title}`} fit="contain" className="mb-6 h-auto max-h-[32rem] w-full rounded-2xl bg-chalk" />}
                  <p className="text-sm font-bold uppercase text-leaf">
                    {action.edition?.title ? `${action.edition.title} · ` : ""}Journée {action.dayNumber ?? ""} · {upcoming ? "À venir" : "Terminée"}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-forest">{action.title}</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/75">{action.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/70">
                    <li className="inline-flex items-center gap-2"><CalendarDays size={16} aria-hidden />{formatDate(action.date)}</li>
                    {action.time && <li className="inline-flex items-center gap-2"><Clock size={16} aria-hidden />{action.time}</li>}
                    <li className="inline-flex items-center gap-2"><MapPin size={16} aria-hidden />{action.location}</li>
                  </ul>
                  {upcoming && action.description && <p className="mt-4 whitespace-pre-line text-ink/75">{action.description}</p>}
                  {!upcoming && photos.length > 0 && (
                    <section className="mt-7">
                      <h3 className="mb-4 text-lg font-bold text-forest">Photos de la journée</h3>
                      <Gallery showFilters={false} photos={photos.map((photo) => ({ id: photo.id, url: photo.url, title: photo.title, category: photo.category, actionTitle: action.title }))} />
                    </section>
                  )}
                  <Link href={`/actions/${action.slug}`} className="btn-line mt-5 !px-4 !py-2 text-sm">Tous les détails</Link>
                </article>
              </li>
            );
          })}
        </ol>
      )}
      {unassignedPhotos.length > 0 && (
        <section className="mt-12 border-t border-black/10 pt-8">
          <h2 className="mb-5 text-2xl font-bold text-forest">Autres photos du quartier</h2>
          <Gallery showFilters={false} photos={unassignedPhotos.map((photo) => ({ id: photo.id, url: photo.url, title: photo.title, category: photo.category, actionTitle: photo.action?.title ?? null }))} />
        </section>
      )}
    </div>
  );
}
