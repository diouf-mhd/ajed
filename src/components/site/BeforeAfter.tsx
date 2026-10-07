"use client";

import { useState } from "react";
import { Img } from "@/components/ui/Img";

/** Comparateur Avant / Après : le curseur (input range) est accessible au clavier et au toucher. */
export function BeforeAfter({ before, after, caption }: { before: string; after: string; caption: string }) {
  const [pos, setPos] = useState(50);

  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest-900 select-none">
        <Img src={after} alt={`Après : ${caption}`} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Img src={before} alt={`Avant : ${caption}`} className="h-full w-full" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white">Avant</span>
        <span className="absolute right-3 top-3 rounded-full bg-sun px-3 py-1 text-sm font-semibold text-ink">Après</span>
        <div className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-forest shadow-lg">↔</span>
        </div>
        <input
          type="range" min={0} max={100} value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Comparer avant et après"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 text-center text-ink/70">{caption}</figcaption>
    </figure>
  );
}
