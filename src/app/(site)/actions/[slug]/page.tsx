import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Gallery } from "@/components/site/Gallery";
import { getAction } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getAction((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.summary,
    openGraph: { title: a.title, description: a.summary, images: a.coverImage ? [a.coverImage] : undefined },
  };
}

const Block = ({ title, text }: { title: string; text?: string | null }) =>
  text ? (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-forest">{title}</h2>
      <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-ink/80">{text}</p>
    </section>
  ) : null;

export default async function ActionPage({ params }: Props) {
  const a = await getAction((await params).slug);
  if (!a) notFound();

  const meta = [
    { icon: CalendarDays, text: formatDate(a.date) },
    a.time && { icon: Clock, text: a.time },
    { icon: MapPin, text: a.location },
    a.participants != null && { icon: Users, text: `${a.participants} participants` },
  ].filter(Boolean) as { icon: typeof Clock; text: string }[];

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-forest-900 text-white">
        <Img src={a.coverImage} alt={a.title} priority className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/60 to-forest-900/20" />
        <div className="wrap flex min-h-[55svh] flex-col justify-end pb-12 pt-24">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">{a.title}</h1>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-white/90">
            {meta.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2"><Icon size={18} className="text-sun" aria-hidden />{text}</li>
            ))}
          </ul>
        </div>
      </header>

      <div className="wrap section max-w-3xl">
        <p className="whitespace-pre-line text-xl leading-relaxed text-ink/90">{a.description}</p>
        <Block title="Objectifs" text={a.objectives} />
        <Block title="Résultats" text={a.results} />

        {a.videoUrl && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-forest">Vidéo</h2>
            <a href={a.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-line mt-3">Regarder la vidéo</a>
          </section>
        )}

        {a.beforeAfter && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold text-forest">Avant / Après</h2>
            <BeforeAfter before={a.beforeAfter.beforeUrl} after={a.beforeAfter.afterUrl} caption={a.beforeAfter.caption || a.title} />
          </section>
        )}
      </div>

      {a.photos.length > 0 && (
        <section className="wrap pb-12">
          <h2 className="mb-6 text-2xl font-bold text-forest">Photos de l&apos;action</h2>
          <Gallery showFilters={false} photos={a.photos.map((p) => ({ id: p.id, url: p.url, title: p.title, category: p.category, actionTitle: a.title }))} />
        </section>
      )}

      <div className="wrap pb-20 text-center"><Link href="/actions" className="btn-forest">Voir toutes les actions</Link></div>
    </article>
  );
}
