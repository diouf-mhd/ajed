import type { Metadata } from "next";
import { ContactInfo } from "@/components/site/ContactInfo";
import { JoinSection } from "@/components/site/JoinSection";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Contact", description: "Contactez l'AJED ou rejoignez l'association." };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <>
      <div className="wrap section">
        <SectionTitle title="Contact" intro="Une question, une idée, un partenariat ? Écrivez-nous." />
        <div className="mt-8"><ContactInfo s={s} /></div>
      </div>
      <JoinSection />
    </>
  );
}
