import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "À propos",
  description: "Vision, mission et valeurs de l'AJED, l'Association des Jeunes Espoirs de Dougar.",
};

const VALUES = [
  ["Solidarité", "On avance ensemble, avec les habitants."],
  ["Engagement", "On passe de l'idée à l'action, sur le terrain."],
  ["Propreté", "Un cadre de vie soigné est un droit pour tous."],
  ["Innovation", "On essaie, on apprend, on améliore."],
];
const GOALS = [
  "Organiser des opérations de nettoyage régulières.",
  "Sensibiliser la population à la propreté et à l'environnement.",
  "Mobiliser et former les jeunes aux actions communautaires.",
  "Promouvoir des initiatives innovantes pour Dougar.",
  "Améliorer progressivement le cadre de vie.",
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-forest text-white">
        <div className="wrap section">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">L&apos;AJED, la jeunesse au service de Dougar.</h1>
          <p className="mt-6 max-w-2xl text-xl text-white/85">
            L&apos;Association des Jeunes Espoirs de Dougar rassemble des jeunes qui ont décidé de ne plus attendre pour agir sur leur cadre de vie.
          </p>
        </div>
      </section>

      <section className="wrap section grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="h2 text-forest">Notre vision</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">Un Dougar propre, solidaire et innovant, où chaque habitant se sent responsable de son environnement.</p>
        </div>
        <div>
          <h2 className="h2 text-forest">Notre mission</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">Mobiliser les jeunes pour mener des actions concrètes : nettoyage, sensibilisation, projets communautaires et idées nouvelles.</p>
        </div>
      </section>

      <section className="bg-chalk">
        <div className="wrap section">
          <SectionTitle title="Nos valeurs" />
          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            {VALUES.map(([t, d]) => (
              <div key={t} className="rounded-3xl bg-white p-7 ring-1 ring-black/10">
                <dt className="text-2xl font-bold text-forest">{t}</dt>
                <dd className="mt-1 text-ink/70">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap section grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="h2 text-forest">Nos objectifs</h2>
          <ul className="mt-6 space-y-3 text-lg text-ink/80">
            {GOALS.map((g) => <li key={g} className="border-l-4 border-sun pl-4">{g}</li>)}
          </ul>
        </div>
        <div className="rounded-3xl bg-sun p-8 sm:p-10">
          <h2 className="text-3xl font-extrabold leading-tight">Pourquoi la jeunesse ?</h2>
          <p className="mt-4 text-lg leading-relaxed">Parce que les jeunes sont l&apos;énergie de Dougar : ce sont eux qui vivront le Dougar de demain. En les impliquant aujourd&apos;hui, on construit une ville durablement plus propre et plus solidaire.</p>
          <Link href="/contact#rejoindre" className="btn-forest mt-6">Rejoindre l&apos;AJED</Link>
        </div>
      </section>
    </>
  );
}
