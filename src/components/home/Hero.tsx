import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Img } from "@/components/ui/Img";

export function Hero({ image }: { image?: string | null }) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 text-white">
      <Img src={image} alt="Vue de Dougar" priority className="absolute inset-0 -z-20 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/70 to-forest-900/30" />

      <div className="wrap flex min-h-[calc(100svh-72px)] flex-col justify-end pb-36 pt-16 sm:pb-44">
        <div className="animate-rise grid h-20 w-20 place-items-center rounded-full bg-white shadow-xl">
          <Logo className="h-14 w-14" />
        </div>
        <h1 className="animate-rise mt-8 max-w-4xl text-[2.6rem] font-extrabold leading-[0.98] tracking-tight [animation-delay:.15s] sm:text-7xl">
          Ensemble, construisons un Dougar plus propre, plus beau et plus innovant.
        </h1>
        <p className="animate-rise mt-6 max-w-xl text-lg text-white/85 [animation-delay:.3s]">
          Des jeunes de Dougar qui nettoient, sensibilisent et inventent le quotidien de leur ville.
        </p>
        <div className="animate-rise mt-9 flex flex-col gap-3 [animation-delay:.45s] sm:flex-row">
          <Link href="/actions" className="btn-sun">Découvrir nos actions</Link>
          <Link href="/contact#rejoindre" className="btn-ghost">Rejoindre l&apos;AJED</Link>
        </div>
      </div>
    </section>
  );
}
