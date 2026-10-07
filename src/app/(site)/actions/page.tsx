import type { Metadata } from "next";
import { ActionCard } from "@/components/site/ActionCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getLatestActions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos actions",
  description: "Toutes les actions de l'AJED pour un Dougar plus propre et plus solidaire.",
};

export default async function ActionsPage() {
  const actions = await getLatestActions(100);
  return (
    <div className="wrap section">
      <SectionTitle title="Nos actions" intro="Nettoyages, sensibilisations, projets : retrouvez tout ce que l'AJED a fait pour Dougar." />
      {actions.length === 0 ? (
        <p className="mt-10 text-ink/70">Aucune action publiée pour l&apos;instant.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((a) => <ActionCard key={a.id} {...a} />)}
        </div>
      )}
    </div>
  );
}
