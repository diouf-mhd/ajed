import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getQuartiers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quartiers de Dougar",
  description: "Suivez les journées de l'AJED dans les quartiers de Dougar.",
};

const statusLabel = { DONE: "Journée terminée", UPCOMING: "À venir", NONE: "Pas encore de journée" } as const;

export default async function QuartiersPage() {
  const quartiers = await getQuartiers();
  return (
    <div className="wrap section">
      <SectionTitle title="Les quartiers de Dougar" intro="Retrouvez les journées, les annonces et les photos de chaque quartier." />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quartiers.map((quartier) => (
          <li key={quartier.id}>
            <Link href={`/quartiers/${quartier.slug}`} className="block rounded-2xl bg-chalk p-6 transition-colors hover:bg-sun/30">
              <span className="flex items-start justify-between gap-3">
                <span className="text-xl font-bold text-forest">{quartier.name}</span>
                <span className="text-right text-xs font-semibold text-leaf">{statusLabel[quartier.status]}</span>
              </span>
              <span className="mt-4 block text-sm text-ink/65">{quartier.dayCount} journée{quartier.dayCount > 1 ? "s" : ""} publiée{quartier.dayCount > 1 ? "s" : ""}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
