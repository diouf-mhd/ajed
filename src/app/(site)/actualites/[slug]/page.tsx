import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Img } from "@/components/ui/Img";
import { getNewsItem } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await getNewsItem((await params).slug);
  if (!n) return {};
  return { title: n.title, description: n.summary, openGraph: { title: n.title, description: n.summary, images: n.image ? [n.image] : undefined } };
}

export default async function NewsItemPage({ params }: Props) {
  const n = await getNewsItem((await params).slug);
  if (!n) notFound();
  return (
    <article className="wrap section max-w-3xl">
      <p className="font-medium text-leaf">{formatDate(n.date)}</p>
      <h1 className="mt-2 text-4xl font-extrabold leading-tight text-forest sm:text-5xl">{n.title}</h1>
      <p className="mt-4 text-xl text-ink/70">{n.summary}</p>
      <Img src={n.image} alt={n.title} priority className="mt-8 aspect-[16/9] w-full rounded-3xl" />
      <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-ink/85">{n.content}</div>
      <Link href="/actualites" className="btn-forest mt-12">Toutes les actualités</Link>
    </article>
  );
}
