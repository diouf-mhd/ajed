import { ImageField, Field, PageHeader } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/ui";
import { getSettings } from "@/lib/data";
import { saveSettings } from "../server-actions";

export default async function AdminSettings() {
  const s = await getSettings();
  return (
    <div className="max-w-2xl">
      <PageHeader title="Paramètres" />
      <form action={saveSettings} className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-8">
        <ImageField label="Photo du hero (page d'accueil)" name="heroFile" keepName="heroImage" current={s.heroImage} />
        <Field label="Téléphone" name="phone" type="tel" defaultValue={s.phone} />
        <Field label="Email" name="email" type="email" defaultValue={s.email} />
        <Field label="WhatsApp (avec indicatif)" name="whatsapp" defaultValue={s.whatsapp} placeholder="+221 77 000 00 00" />
        <Field label="Facebook (lien)" name="facebook" type="url" defaultValue={s.facebook} />
        <Field label="Instagram (lien)" name="instagram" type="url" defaultValue={s.instagram} />
        <Field label="Localisation" name="address" defaultValue={s.address} />
        <SubmitButton>Enregistrer</SubmitButton>
      </form>
      <p className="mt-6 text-sm text-ink/60">Le mot de passe administrateur se change dans la variable d&apos;environnement <code>ADMIN_PASSWORD</code> (fichier .env), puis redémarrage du site.</p>
    </div>
  );
}
