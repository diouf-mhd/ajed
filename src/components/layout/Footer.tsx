import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { getSettings } from "@/lib/data";

const QUICK = [
  { href: "/actions", label: "Nos actions" },
  { href: "/galerie", label: "Galerie" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const s = await getSettings();
  const socials = [
    { label: "Facebook", href: s.facebook },
    { label: "Instagram", href: s.instagram },
    { label: "WhatsApp", href: s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` : "" },
  ].filter((x) => x.href);

  return (
    <footer className="bg-forest-900 text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-14 w-14" />
            <div>
              <p className="font-display text-2xl font-bold">AJED</p>
              <p className="text-sm text-white/75">Association des Jeunes Espoirs de Dougar</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-white/70">Un Dougar plus propre, plus solidaire et plus innovant, porté par sa jeunesse.</p>
        </div>

        <nav aria-label="Navigation rapide">
          <p className="font-display text-lg font-semibold text-sun">Navigation rapide</p>
          <ul className="mt-4 space-y-2">
            {QUICK.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/80 hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-display text-lg font-semibold text-sun">Réseaux sociaux</p>
          <ul className="mt-4 space-y-2">
            {socials.length === 0 && <li className="text-white/60">Bientôt disponibles</li>}
            {socials.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 AJED — Tous droits réservés. <span aria-hidden="true">·</span>{" "}
            <Link href="/admin/login" className="text-white/45 underline-offset-4 hover:text-white/80 hover:underline">Administration</Link>
          </p>
          <p>
            Site développé par{" "}
            <a href="https://moussadioufportfolio.kesug.com" target="_blank" rel="noopener noreferrer" className="font-medium text-white/80 underline-offset-4 hover:underline">
              Moussa Diouf
            </a>{" "}
            · Administrateur systèmes / Développeur Full Stack
          </p>
        </div>
      </div>
    </footer>
  );
}
