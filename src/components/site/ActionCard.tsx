import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { formatDate } from "@/lib/utils";

type Props = { slug: string; title: string; date: Date; location: string; summary: string; coverImage: string | null };

export function ActionCard({ slug, title, date, location, summary, coverImage }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/10">
      <Link href={`/actions/${slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden>
        <Img src={coverImage} alt="" className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-leaf">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} aria-hidden />{formatDate(date)}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden />{location}</span>
        </p>
        <h3 className="mt-3 text-xl font-bold leading-snug text-forest">{title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-ink/70">{summary}</p>
        <Link href={`/actions/${slug}`} className="btn-line mt-5 self-start !py-2.5">
          Voir l&apos;action<span className="sr-only"> : {title}</span>
        </Link>
      </div>
    </article>
  );
}
