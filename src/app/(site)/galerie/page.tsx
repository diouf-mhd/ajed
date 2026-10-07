import type { Metadata } from "next";
import { Gallery } from "@/components/site/Gallery";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Galerie", description: "Les photos des actions de l'AJED à Dougar." };

export default async function GalleryPage() {
  const photos = await getPhotos();
  return (
    <div className="wrap section">
      <SectionTitle title="Galerie" intro="Les moments forts de nos actions, classés par catégorie." />
      <div className="mt-10">
        <Gallery photos={photos.map((p) => ({ id: p.id, url: p.url, title: p.title, category: p.category, actionTitle: p.action?.title ?? null }))} />
      </div>
    </div>
  );
}
