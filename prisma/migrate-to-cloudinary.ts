/**
 * Migre toutes les images/vidéos déjà en base (Vercel Blob, /api/files, etc.) vers Cloudinary
 * et met à jour les URLs dans la base de données.
 *
 *   Test sans rien modifier :  npx tsx --env-file=.env prisma/migrate-to-cloudinary.ts --dry-run
 *   Migration réelle :         npx tsx --env-file=.env prisma/migrate-to-cloudinary.ts
 *
 * Variables requises dans .env : DATABASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
 * Relançable sans risque : les URLs déjà sur Cloudinary sont ignorées.
 */
import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary, type ResourceType } from "../src/lib/cloudinary-core";

const dryRun = process.argv.includes("--dry-run");
const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
if (!cloudName || !apiKey || !apiSecret) throw new Error("Variables CLOUDINARY_* manquantes dans .env");
const config = { cloudName, apiKey, apiSecret };
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

const db = new PrismaClient();
const cache = new Map<string, string>();
const stats = { migrated: 0, skipped: 0, failed: 0 };

async function migrate(url: string | null | undefined, type: ResourceType = "image"): Promise<string | null> {
  if (!url || url.includes("res.cloudinary.com")) return null;
  if (cache.has(url)) return cache.get(url)!;
  // Les anciens fichiers locaux (/api/files/xxx.png) sont téléchargés depuis le site public.
  const source = url.startsWith("/") ? `${SITE_URL}${url}` : url;
  if (!/^https?:\/\//.test(source)) {
    console.warn(`  ! URL ignorée (non absolue, renseignez NEXT_PUBLIC_SITE_URL) : ${url}`);
    stats.skipped++;
    return null;
  }
  if (dryRun) {
    console.log(`  [dry-run] ${url}`);
    stats.skipped++;
    return null;
  }
  try {
    const next = await uploadToCloudinary(config, source, type);
    cache.set(url, next);
    stats.migrated++;
    console.log(`  ✓ ${url}\n    → ${next}`);
    return next;
  } catch (error) {
    stats.failed++;
    console.error(`  ✗ ${url} : ${error instanceof Error ? error.message : error}`);
    return null;
  }
}

async function main() {
  console.log(dryRun ? "== SIMULATION (aucune modification) ==" : "== MIGRATION vers Cloudinary ==");

  console.log("\nPhotos de la galerie");
  for (const row of await db.photo.findMany({ select: { id: true, url: true } })) {
    const url = await migrate(row.url);
    if (url) await db.photo.update({ where: { id: row.id }, data: { url } });
  }

  console.log("\nActions (couverture, affiche, vidéo)");
  for (const row of await db.action.findMany({ select: { id: true, coverImage: true, poster: true, videoUrl: true } })) {
    const data: { coverImage?: string; poster?: string; videoUrl?: string } = {};
    const cover = await migrate(row.coverImage);
    if (cover) data.coverImage = cover;
    const poster = await migrate(row.poster);
    if (poster) data.poster = poster;
    // Seules les vidéos hébergées chez nous sont migrées (pas YouTube, etc.).
    if (row.videoUrl && /\.public\.blob\.vercel-storage\.com|^\/api\/files\//.test(row.videoUrl)) {
      const video = await migrate(row.videoUrl, "video");
      if (video) data.videoUrl = video;
    }
    if (Object.keys(data).length) await db.action.update({ where: { id: row.id }, data });
  }

  console.log("\nAvant / après");
  for (const row of await db.beforeAfter.findMany({ select: { id: true, beforeUrl: true, afterUrl: true } })) {
    const beforeUrl = await migrate(row.beforeUrl);
    const afterUrl = await migrate(row.afterUrl);
    if (beforeUrl || afterUrl) await db.beforeAfter.update({ where: { id: row.id }, data: { ...(beforeUrl && { beforeUrl }), ...(afterUrl && { afterUrl }) } });
  }

  console.log("\nActualités");
  for (const row of await db.news.findMany({ select: { id: true, image: true } })) {
    const image = await migrate(row.image);
    if (image) await db.news.update({ where: { id: row.id }, data: { image } });
  }

  console.log("\nÉvénements");
  for (const row of await db.event.findMany({ select: { id: true, image: true } })) {
    const image = await migrate(row.image);
    if (image) await db.event.update({ where: { id: row.id }, data: { image } });
  }

  console.log("\nImage du hero");
  const hero = await db.setting.findUnique({ where: { key: "heroImage" } });
  const heroUrl = await migrate(hero?.value);
  if (heroUrl) await db.setting.update({ where: { key: "heroImage" }, data: { value: heroUrl } });

  console.log(`\nTerminé : ${stats.migrated} migrée(s), ${stats.skipped} ignorée(s), ${stats.failed} échec(s).`);
  if (stats.failed) console.log("Relancez le script : seuls les fichiers en échec seront retentés.");
}

main().finally(() => db.$disconnect());
