import type { Metadata } from "next";
import { NewsCard } from "@/components/site/NewsCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getNews } from "@/lib/data";

export const metadata: Metadata = { title: "Actualités", description: "Les dernières nouvelles de l'AJED." };

export default async function NewsPage() {
  const news = await getNews();
  return (
    <div className="wrap section">
      <SectionTitle title="Actualités" intro="Les dernières nouvelles de l'AJED et de Dougar." />
      {news.length === 0 ? (
        <p className="mt-10 text-ink/70">Aucune actualité pour le moment.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{news.map((n) => <NewsCard key={n.id} {...n} />)}</div>
      )}
    </div>
  );
}
