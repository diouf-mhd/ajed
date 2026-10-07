
import { cache } from "react";
import type { PhotoCategory } from "@prisma/client";
import { db } from "./db";

const published = { status: "PUBLISHED" as const };

export const getLatestActions = cache((take = 6) =>
  db.action.findMany({ where: published, orderBy: { date: "desc" }, take }),
);

export const getAction = cache((slug: string) =>
  db.action.findFirst({
    where: { slug, ...published },
    include: { photos: { orderBy: { createdAt: "asc" } }, beforeAfter: true },
  }),
);

export const getFeaturedActions = cache((take = 3) =>
  db.action.findMany({ where: { ...published, featured: true }, orderBy: { date: "desc" }, take }),
);

export const getBeforeAfters = cache((take = 3) =>
  db.beforeAfter.findMany({
    where: { action: published },
    include: { action: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take,
  }),
);

export const getStats = cache(() => db.statistic.findMany({ orderBy: { order: "asc" } }));

export const getPhotos = cache((opts: { take?: number; category?: PhotoCategory } = {}) =>
  db.photo.findMany({
    where: {
      category: opts.category,
      OR: [{ actionId: null }, { action: published }],
    },
    include: { action: { select: { title: true, slug: true } } },
    orderBy: { date: "desc" },
    take: opts.take,
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
