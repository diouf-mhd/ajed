import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = ["", "/actions", "/galerie", "/actualites", "/a-propos", "/contact"].map((p) => ({
    url: `${base}${p}`,
  }));
  try {
    const [actions, news] = await Promise.all([
      db.action.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      db.news.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...pages,
      ...actions.map((a) => ({ url: `${base}/actions/${a.slug}`, lastModified: a.updatedAt })),
      ...news.map((n) => ({ url: `${base}/actualites/${n.slug}`, lastModified: n.updatedAt })),
    ];
  } catch {
    return pages;
  }
}
