import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/site/ScrollReveal";

// Le contenu public vient de la base : on l'évalue à chaque requête (une action publiée apparaît tout de suite).
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-sun focus:px-4 focus:py-2">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu">
        <ScrollReveal />
        {children}
      </main>
      <Footer />
    </>
  );
}
