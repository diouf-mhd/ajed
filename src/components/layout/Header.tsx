"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/#mission", label: "Notre mission" },
  { href: "/actions", label: "Nos actions" },
  { href: "/#realisations", label: "Réalisations" },
  { href: "/galerie", label: "Galerie" },
  { href: "/actualites", label: "Actualités" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white/90 backdrop-blur transition-shadow",
        scrolled && "shadow-[0_2px_20px_rgba(0,0,0,.08)]",
      )}
    >
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="AJED, retour à l'accueil" onClick={() => setOpen(false)}>
          <Logo />
          <span className="hidden font-display text-xl font-bold text-forest sm:block">AJED</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 xl:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[15px] font-medium text-ink/80 hover:text-forest">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact#rejoindre" className="btn-sun hidden !py-2.5 sm:inline-flex">
            Rejoindre l&apos;AJED
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-forest text-white xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Menu mobile"
          className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-forest px-6 py-8 xl:hidden"
        >
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/15 py-4 font-display text-2xl font-semibold text-white"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact#rejoindre" onClick={() => setOpen(false)} className="btn-sun mt-8 w-full">
            Rejoindre l&apos;AJED
          </Link>
        </nav>
      )}
    </header>
  );
}
