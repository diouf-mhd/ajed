import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/utils";

const db = new PrismaClient();

const quartierNames = [
  "Aithia", "Poutou", "Dabathie", "Yam", "Mbouka", "Loss", "Lossa", "Gola",
  "Kahane Fall", "Dougar Peulh", "Santhia",
];

async function main() {
  if ((await db.statistic.count()) === 0) {
    await db.statistic.createMany({
      data: [
        { label: "Actions menées", value: 0, suffix: "", order: 1 },
        { label: "Bénévoles mobilisés", value: 0, suffix: "", order: 2 },
        { label: "Zones nettoyées", value: 0, suffix: "", order: 3 },
        { label: "Projets réalisés", value: 0, suffix: "", order: 4 },
        { label: "Quartiers couverts", value: 11, suffix: "", order: 5 },
      ],
    });
  }
  if (!(await db.statistic.findFirst({ where: { label: "Quartiers couverts" } }))) {
    const last = await db.statistic.findFirst({ orderBy: { order: "desc" } });
    await db.statistic.create({ data: { label: "Quartiers couverts", value: 11, suffix: "", order: (last?.order ?? 0) + 1 } });
  }

  for (const [index, name] of quartierNames.entries()) {
    const slug = slugify(name);
    await db.quartier.upsert({
      where: { slug },
      update: { name, order: index + 1 },
      create: { name, slug, order: index + 1 },
    });
  }
  await db.edition.upsert({
    where: { number: 3 },
    update: { title: "3e édition" },
    create: { number: 3, title: "3e édition" },
  });

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

}

main().finally(() => db.$disconnect());
