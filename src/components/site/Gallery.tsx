"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CATEGORIES, cn } from "@/lib/utils";

export type GalleryPhoto = {
  id: string;
  url: string;
  title: string | null;
  category: string;
  actionTitle: string | null;
};

export function Gallery({ photos, showFilters = true }: { photos: GalleryPhoto[]; showFilters?: boolean }) {
  const [category, setCategory] = useState("ALL");
  const [action, setAction] = useState("ALL");
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const actions = useMemo(() => [...new Set(photos.map((p) => p.actionTitle).filter(Boolean))] as string[], [photos]);
  const visible = photos.filter(
    (p) => (category === "ALL" || p.category === category) && (action === "ALL" || p.actionTitle === action),
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % visible.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + visible.length) % visible.length));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, visible.length]);

  const current = open !== null ? visible[open] : null;
  const tabs = [{ value: "ALL", label: "Toutes" }, ...CATEGORIES];

  return (
    <div>
      {showFilters && (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
            {tabs.map((t) => (
              <button key={t.value} type="button" aria-pressed={category === t.value} onClick={() => setCategory(t.value)}
                className={cn("rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  category === t.value ? "bg-forest text-white" : "bg-chalk text-forest hover:bg-sun")}>
                {t.label}
              </button>
            ))}
          </div>
          {actions.length > 0 && (
            <label className="flex items-center gap-2 text-sm font-medium">
              Action
              <select className="input !w-auto !py-2" value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="ALL">Toutes les actions</option>
                {actions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-chalk p-8 text-center text-ink/70">Aucune photo pour le moment.</p>
      ) : (
        <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {visible.map((p, i) => (
            <li key={p.id} className="mb-3 break-inside-avoid">
              <button type="button" onClick={() => setOpen(i)} className="block w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.title ?? p.actionTitle ?? "Photo de l'AJED"} loading="lazy" decoding="async"
                  className="w-full transition-transform duration-500 hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!showFilters && (
        <div className="mt-8 text-center"><Link href="/galerie" className="btn-forest">Voir toute la galerie</Link></div>
      )}

      {current && (
        <div role="dialog" aria-modal="true" aria-label="Photo en plein écran"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setOpen(null)}>
          <button ref={closeRef} type="button" aria-label="Fermer" onClick={() => setOpen(null)}
            className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white hover:bg-white/30"><X /></button>
          {visible.length > 1 && (
            <>
              <button type="button" aria-label="Photo précédente" onClick={(e) => { e.stopPropagation(); setOpen((open! - 1 + visible.length) % visible.length); }}
                className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white hover:bg-white/30"><ChevronLeft /></button>
              <button type="button" aria-label="Photo suivante" onClick={(e) => { e.stopPropagation(); setOpen((open! + 1) % visible.length); }}
                className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white hover:bg-white/30"><ChevronRight /></button>
            </>
          )}
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.title ?? current.actionTitle ?? "Photo de l'AJED"} className="max-h-[80vh] rounded-xl object-contain" />
            {(current.title || current.actionTitle) && (
              <figcaption className="mt-3 text-center text-white/80">{current.title ?? current.actionTitle}</figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
