import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/admin/ui";
import { isAdmin } from "@/lib/auth";
import { logout } from "./server-actions";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin", label: "📊 Dashboard" },
  { href: "/admin/actions", label: "🌱 Actions" },
  { href: "/admin/galerie", label: "📸 Galerie" },
  { href: "/admin/actualites", label: "📰 Actualités" },
  { href: "/admin/evenements", label: "📅 Événements" },
  { href: "/admin/statistiques", label: "🏆 Réalisations & stats" },
  { href: "/admin/candidatures", label: "✉️ Candidatures" },
  { href: "/admin/parametres", label: "⚙️ Paramètres" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // La page de connexion n'a pas de session : on n'affiche le cadre que si connecté.
  if (!(await isAdmin())) return <div className="min-h-screen bg-chalk">{children}</div>;

  return (
    <div className="min-h-screen bg-chalk md:flex">
      <aside className="bg-forest-900 p-4 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto">
        <div className="mb-4 flex items-center justify-between gap-3 md:mb-8 md:block">
          <div className="flex items-center gap-3 text-white"><Logo className="h-10 w-10" /><span className="font-display text-lg font-bold">Admin AJED</span></div>
          <form action={logout} className="md:mt-4"><button className="text-sm text-white/70 underline-offset-4 hover:underline">Se déconnecter</button></form>
        </div>
        <nav aria-label="Administration" className="flex gap-1 overflow-x-auto md:flex-col">
          {LINKS.map((l) => <NavLink key={l.href} href={l.href}>{l.label}</NavLink>)}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 p-5 sm:p-8">{children}</div>
    </div>
  );
}
