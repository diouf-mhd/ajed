"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, CalendarDays } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";

export type Slide = {
  slug: string;
  title: string;
  date: string;
  time?: string | null;
  location: string;
  summary: string;
  image?: string | null;
};

export function ActionsCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count, paused]);

  if (count === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">
        <p className="font-display text-2xl font-bold text-forest">Les prochaines actions arrivent bientôt.</p>
        <p className="mt-2 text-ink/70">Revenez vite : l&apos;AJED prépare de nouvelles initiatives.</p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label="Dernières actions de l'AJED"
      className="relative overflow-hidden rounded-3xl bg-forest-900 shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <article
            key={s.slug}
            className="relative aspect-[4/5] w-full shrink-0 text-white sm:aspect-[16/8]"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${count}`}
            aria-hidden={i !== index}
          >
            <Img src={s.image} alt={s.title} priority={i === 0} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 pb-14 sm:max-w-2xl sm:p-10 sm:pb-14">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-sun">
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} aria-hidden />{s.date}{s.time ? ` · ${s.time}` : ""}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={16} aria-hidden />{s.location}</span>
              </p>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">{s.title}</h3>
              <p className="mt-3 line-clamp-2 text-base text-white/85 sm:text-lg">« {s.summary} »</p>
              <Link href={`/actions/${s.slug}`} tabIndex={i === index ? 0 : -1} className="btn-sun mt-6">
                Découvrir l&apos;action
              </Link>
            </div>
          </article>
        ))}
      </div>

      {count > 1 && (
        <>
          <button type="button" onClick={() => go(index - 1)} aria-label="Action précédente"
            className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest hover:bg-sun sm:grid">
            <ChevronLeft />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Action suivante"
            className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest hover:bg-sun sm:grid">
            <ChevronRight />
          </button>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2" role="tablist" aria-label="Choisir une action">
            {slides.map((s, i) => (
              <button key={s.slug} type="button" role="tab" aria-selected={i === index} aria-label={`Voir : ${s.title}`}
                onClick={() => go(i)}
                className={cn("h-2.5 rounded-full transition-all", i === index ? "w-8 bg-sun" : "w-2.5 bg-white/60 hover:bg-white")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
