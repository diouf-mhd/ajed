"use client";

import { useEffect, useRef, useState } from "react";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(value);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1400, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <p ref={ref} className="font-display text-5xl font-extrabold text-sun sm:text-6xl" aria-label={`${value}${suffix}`}>
      {n.toLocaleString("fr-FR")}{suffix}
    </p>
  );
}

export function StatsCounter({ stats }: { stats: { id: string; label: string; value: number; suffix: string }[] }) {
  if (stats.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.id}>
          <dd><Counter value={s.value} suffix={s.suffix} /></dd>
          <dt className="mt-2 text-white/80">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
