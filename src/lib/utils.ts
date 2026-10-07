import clsx, { type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const SITE_NAME = "AJED — Association des Jeunes Espoirs de Dougar";
export const SITE_DESCRIPTION =
  "L'AJED œuvre pour un Dougar plus propre, plus solidaire et plus innovant grâce à l'engagement de la jeunesse.";

export const CATEGORIES = [
  { value: "NETTOYAGE", label: "Nettoyage" },
  { value: "ENVIRONNEMENT", label: "Environnement" },
  { value: "JEUNESSE", label: "Jeunesse" },
  { value: "EVENEMENTS", label: "Événements" },
  { value: "AUTRES", label: "Autres" },
] as const;

export const categoryLabel = (value: string) =>
  CATEGORIES.find((c) => c.value === value)?.label ?? value;

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const formatDate = (d: Date) => dateFmt.format(d);
export const toInputDate = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export function isUpcoming(date: Date, now = new Date()) {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  return date >= today;
}

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
