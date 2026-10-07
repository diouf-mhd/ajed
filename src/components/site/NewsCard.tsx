import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { formatDate } from "@/lib/utils";

export function NewsCard({ slug, title, summary, image, date }: { slug: string; title: string; summary: string; image: string | null; date: Date }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white ring-1 ring-black/10">
      <Link href={`/actualites/${slug}`} className="block">
        <div className="overflow-hidden">
          <Img src={image} alt="" className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-6">
          <p className="text-sm font-medium text-leaf">{formatDate(date)}</p>
          <h3 className="mt-2 text-xl font-bold leading-snug text-forest">{title}</h3>
          <p className="mt-2 line-clamp-3 text-ink/70">{summary}</p>
        </div>
      </Link>
    </article>
  );
}
