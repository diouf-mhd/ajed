
import { cache } from "react";
import type { PhotoCategory } from "@prisma/client";
import { db } from "./db";
import { isUpcoming } from "./utils";

const published = { status: "PUBLISHED" as const };

export const getLatestActions = cache(async (take = 6, opts: { quartierSlug?: string } = {}) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const where = {
    ...published,
    quartiers: opts.quartierSlug ? { some: { slug: opts.quartierSlug } } : undefined,
  };
  const [upcoming, past] = await Promise.all([
    db.action.findMany({ where: { ...where, date: { gte: today } }, include: { quartiers: true, edition: true }, orderBy: { date: "asc" }, take }),
    db.action.findMany({ where: { ...where, date: { lt: today } }, include: { quartiers: true, edition: true }, orderBy: { date: "desc" }, take }),
  ]);
  return [...upcoming, ...past].slice(0, take);
});

export const getAction = cache((slug: string) =>
  db.action.findFirst({
    where: { slug, ...published },
    include: { quartiers: true, edition: true, photos: { include: { quartier: true }, orderBy: { createdAt: "asc" } }, beforeAfter: true },
  }),
);

export const getFeaturedActions = cache((take = 3) =>
  db.action.findMany({ where: { ...published, featured: true }, include: { quartiers: true, edition: true }, orderBy: { date: "desc" }, take }),
);

export const getBeforeAfters = cache((take = 3) =>
  db.beforeAfter.findMany({
    where: { action: published },
    include: { action: { select: { title: true, slug: true, quartiers: true, edition: true } } },
    orderBy: { createdAt: "desc" },
    take,
  }),
);

export const getStats = cache(() => db.statistic.findMany({ orderBy: { order: "asc" } }));

export const getPhotos = cache((opts: { take?: number; category?: PhotoCategory; quartierSlug?: string } = {}) =>
  db.photo.findMany({
    where: {
      category: opts.category,
      AND: [
        { OR: [{ actionId: null }, { action: published }] },
        ...(opts.quartierSlug
          ? [{
              OR: [
                { quartier: { slug: opts.quartierSlug } },
                { quartierId: null, action: { ...published, quartiers: { some: { slug: opts.quartierSlug } } } },
              ],
            }]
          : []),
      ],
    },
    include: { quartier: true, action: { select: { title: true, slug: true } } },
    orderBy: { date: "desc" },
    take: opts.take,
  }),
);

export const getQuartiers = cache(async () => {
  const quartiers = await db.quartier.findMany({
    orderBy: { order: "asc" },
    include: { actions: { where: published, select: { date: true } } },
  });
  return quartiers.map(({ actions, ...quartier }) => ({
    ...quartier,
    status: actions.some((action) => !isUpcoming(action.date))
      ? "DONE" as const
      : actions.some((action) => isUpcoming(action.date))
        ? "UPCOMING" as const
        : "NONE" as const,
    dayCount: actions.length,
  }));
});

export const getQuartier = cache(async (slug: string) => {
  const quartier = await db.quartier.findUnique({
    where: { slug },
    include: {
      actions: {
        where: published,
        include: { edition: true, quartiers: true },
        orderBy: [{ dayNumber: "asc" }, { date: "asc" }],
      },
    },
  });
  if (!quartier) return null;

  const photos = await db.photo.findMany({
    where: {
      AND: [
        { OR: [{ actionId: null }, { action: published }] },
        {
          OR: [
            { quartierId: quartier.id },
            { quartierId: null, actionId: { in: quartier.actions.map((action) => action.id) } },
          ],
        },
      ],
    },
    include: { quartier: true, action: { select: { title: true, slug: true } } },
    orderBy: { date: "desc" },
  });
  return { ...quartier, photos };
});

export const getEditions = cache(() =>
  db.edition.findMany({
    orderBy: { number: "desc" },
    include: {
      actions: {
        where: published,
        include: { quartiers: true },
        orderBy: [{ dayNumber: "asc" }, { date: "asc" }],
      },
    },
  }),
);

export const getNews = cache((take?: number) =>
  db.news.findMany({ where: published, orderBy: { date: "desc" }, take }),
);

export const getNewsItem = cache((slug: string) =>
  db.news.findFirst({ where: { slug, ...published } }),
);

export const getUpcomingEvents = cache((take = 3) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return db.event.findMany({
    where: { ...published, date: { gte: today } },
    orderBy: { date: "asc" },
    take,
  });
});

export const SETTING_KEYS = ["phone", "email", "whatsapp", "facebook", "instagram", "address", "heroImage"] as const;
export type Settings = Record<(typeof SETTING_KEYS)[number], string>;

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await db.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(SETTING_KEYS.map((k) => [k, map[k] ?? ""])) as Settings;
});
