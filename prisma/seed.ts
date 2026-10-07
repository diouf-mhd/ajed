import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  if ((await db.statistic.count()) === 0) {
    await db.statistic.createMany({
      data: [
        { label: "Actions menées", value: 0, suffix: "", order: 1 },
        { label: "Bénévoles mobilisés", value: 0, suffix: "", order: 2 },
        { label: "Zones nettoyées", value: 0, suffix: "", order: 3 },
        { label: "Projets réalisés", value: 0, suffix: "", order: 4 },
      ],
    });
  }

  const defaults: Record<string, string> = {
    phone: "",
    email: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    address: "Dougar",
  };
  for (const [key, value] of Object.entries(defaults)) {
    await db.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  // Exemple d'action pour prévisualiser le site (à supprimer depuis /admin)
  await db.action.upsert({
    where: { slug: "nettoyage-mosquee-dougar" },
    update: {},
    create: {
      slug: "nettoyage-mosquee-dougar",
      title: "Nettoyage de la mosquée de Dougar",
      summary: "Ensemble pour un environnement plus propre.",
      description:
        "Les jeunes de l'AJED se retrouvent pour nettoyer la mosquée et ses abords.\n\nVenez avec vos gants et votre bonne humeur.",
      objectives: "Rendre les abords de la mosquée propres.\nSensibiliser les habitants à la propreté.",
      date: new Date("2026-10-11T12:00:00Z"),
      time: "09h00",
      location: "Mosquée de Dougar",
      status: "PUBLISHED",
    },
  });
}

main().finally(() => db.$disconnect());
