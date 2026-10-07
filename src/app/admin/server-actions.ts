"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { PhotoCategory } from "@prisma/client";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { SETTING_KEYS } from "@/lib/data";
import { saveImage } from "@/lib/storage";
import { CATEGORIES, slugify } from "@/lib/utils";

// ---------- helpers ----------
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opt = (f: FormData, k: string) => str(f, k) || null;
const int = (f: FormData, k: string) => {
  const v = parseInt(str(f, k), 10);
  return Number.isFinite(v) ? v : null;
};
const day = (f: FormData, k: string) => new Date(`${str(f, k) || new Date().toISOString().slice(0, 10)}T12:00:00Z`);
const status = (f: FormData) => (str(f, "status") === "PUBLISHED" ? ("PUBLISHED" as const) : ("DRAFT" as const));
const category = (f: FormData, k = "category"): PhotoCategory =>
  (CATEGORIES.find((c) => c.value === str(f, k))?.value ?? "AUTRES") as PhotoCategory;
const files = (f: FormData, k: string) => f.getAll(k).filter((x): x is File => x instanceof File && x.size > 0);

/** Nouvelle image envoyée, sinon on conserve l'URL existante (champ caché). */
async function image(f: FormData, field: string, keep: string) {
  const file = f.get(field);
  if (file instanceof File && file.size > 0) return saveImage(file);
  return opt(f, keep);
}

async function uniqueSlug(kind: "action" | "news", wanted: string, id: string | null) {
  const base = slugify(wanted) || "element";
  let slug = base;
  for (let n = 2; ; n++) {
    const found = kind === "action" ? await db.action.findUnique({ where: { slug } }) : await db.news.findUnique({ where: { slug } });
    if (!found || found.id === id) return slug;
    slug = `${base}-${n}`;
  }
}

const refresh = () => revalidatePath("/", "layout");

// ---------- auth ----------
export async function login(_prev: { error: string } | null, formData: FormData) {
  await new Promise((r) => setTimeout(r, 600)); // ralentit les tentatives automatisées
  if (!checkPassword(String(formData.get("password") ?? ""))) return { error: "Mot de passe incorrect." };
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- actions ----------
export async function saveAction(formData: FormData) {
  await requireAdmin();
  const id = opt(formData, "id");
  const title = str(formData, "title");

  const data = {
    title,
    slug: await uniqueSlug("action", str(formData, "slug") || title, id),
    summary: str(formData, "summary"),
    description: str(formData, "description"),
    objectives: opt(formData, "objectives"),
    results: opt(formData, "results"),
    date: day(formData, "date"),
    time: opt(formData, "time"),
    location: str(formData, "location"),
    participants: int(formData, "participants"),
    dayNumber: int(formData, "dayNumber"),
    videoUrl: opt(formData, "videoUrl"),
    featured: formData.get("featured") === "on",
    status: status(formData),
    coverImage: await image(formData, "cover", "coverImage"),
    poster: await image(formData, "posterFile", "poster"),
  };
  const editionId = opt(formData, "editionId");
  const quartierIds = formData.getAll("quartierIds").map(String);
  const relationData = {
    edition: editionId ? { connect: { id: editionId } } : { disconnect: true },
    quartiers: { set: quartierIds.map((quartierId) => ({ id: quartierId })) },
  };
  const action = id
    ? await db.action.update({ where: { id }, data: { ...data, ...relationData } })
    : await db.action.create({ data: { ...data, edition: editionId ? { connect: { id: editionId } } : undefined, quartiers: { connect: quartierIds.map((quartierId) => ({ id: quartierId })) } } });
  const photoQuartierId = opt(formData, "photoQuartierId");

  for (const file of files(formData, "photos")) {
    const url = await saveImage(file);
    if (url) await db.photo.create({ data: { url, actionId: action.id, quartierId: photoQuartierId && quartierIds.includes(photoQuartierId) ? photoQuartierId : null, category: category(formData, "photoCategory"), date: action.date } });
  }

  const beforeUrl = await image(formData, "before", "beforeUrl");
  const afterUrl = await image(formData, "after", "afterUrl");
  if (beforeUrl && afterUrl) {
    const caption = opt(formData, "baCaption");
    await db.beforeAfter.upsert({
      where: { actionId: action.id },
      update: { beforeUrl, afterUrl, caption },
      create: { actionId: action.id, beforeUrl, afterUrl, caption },
    });
  }

  refresh();
  redirect("/admin/actions");
}

export async function deleteAction(formData: FormData) {
  await requireAdmin();
  await db.action.delete({ where: { id: str(formData, "id") } });
  refresh();
  redirect("/admin/actions");
}

export async function deleteBeforeAfter(formData: FormData) {
  await requireAdmin();
  await db.beforeAfter.deleteMany({ where: { actionId: str(formData, "actionId") } });
  refresh();
  redirect(`/admin/actions/${str(formData, "actionId")}`);
}

// ---------- photos ----------
export async function uploadPhotos(formData: FormData) {
  await requireAdmin();
  const title = opt(formData, "title");
  const actionId = opt(formData, "actionId");
  const quartierId = opt(formData, "quartierId");
  const list = files(formData, "files");
  for (const file of list) {
    const url = await saveImage(file);
    if (url) {
      await db.photo.create({
        data: { url, title: list.length === 1 ? title : null, actionId, quartierId, category: category(formData), date: day(formData, "date") },
      });
    }
  }
  refresh();
  redirect("/admin/galerie");
}

export async function deletePhoto(formData: FormData) {
  await requireAdmin();
  await db.photo.delete({ where: { id: str(formData, "id") } });
  refresh();
  redirect("/admin/galerie");
}

// ---------- actualités ----------
export async function saveNews(formData: FormData) {
  await requireAdmin();
  const id = opt(formData, "id");
  const title = str(formData, "title");
  const data = {
    title,
    slug: await uniqueSlug("news", str(formData, "slug") || title, id),
    summary: str(formData, "summary"),
    content: str(formData, "content"),
    date: day(formData, "date"),
    status: status(formData),
    image: await image(formData, "imageFile", "image"),
  };
  if (id) await db.news.update({ where: { id }, data });
  else await db.news.create({ data });
  refresh();
  redirect("/admin/actualites");
}

export async function deleteNews(formData: FormData) {
  await requireAdmin();
  await db.news.delete({ where: { id: str(formData, "id") } });
  refresh();
  redirect("/admin/actualites");
}

// ---------- événements ----------
export async function saveEvent(formData: FormData) {
  await requireAdmin();
  const id = opt(formData, "id");
  const data = {
    title: str(formData, "title"),
    date: day(formData, "date"),
    time: opt(formData, "time"),
    location: str(formData, "location"),
    description: str(formData, "description"),
    status: status(formData),
    image: await image(formData, "imageFile", "image"),
  };
  if (id) await db.event.update({ where: { id }, data });
  else await db.event.create({ data });
  refresh();
  redirect("/admin/evenements");
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  await db.event.delete({ where: { id: str(formData, "id") } });
  refresh();
  redirect("/admin/evenements");
}

// ---------- statistiques ----------
export async function saveStats(formData: FormData) {
  await requireAdmin();
  const rows = await db.statistic.findMany();
  for (const r of rows) {
    await db.statistic.update({
      where: { id: r.id },
      data: {
        label: str(formData, `label_${r.id}`) || r.label,
        value: int(formData, `value_${r.id}`) ?? 0,
        suffix: str(formData, `suffix_${r.id}`),
        order: int(formData, `order_${r.id}`) ?? r.order,
      },
    });
  }
  refresh();
  redirect("/admin/statistiques");
}

export async function addStat(formData: FormData) {
  await requireAdmin();
  const label = str(formData, "label");
  if (label) {
    const last = await db.statistic.findFirst({ orderBy: { order: "desc" } });
    await db.statistic.create({ data: { label, value: int(formData, "value") ?? 0, suffix: str(formData, "suffix"), order: (last?.order ?? 0) + 1 } });
  }
  refresh();
  redirect("/admin/statistiques");
}

export async function deleteStat(formData: FormData) {
  await requireAdmin();
  await db.statistic.delete({ where: { id: str(formData, "id") } });
  refresh();
  redirect("/admin/statistiques");
}

// ---------- paramètres ----------
export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const hero = await saveImage(formData.get("heroFile") as File);
  for (const key of SETTING_KEYS) {
    const value = key === "heroImage" ? hero ?? str(formData, "heroImage") : str(formData, key);
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  refresh();
  redirect("/admin/parametres");
}

// ---------- candidatures ----------
export async function deleteApplication(formData: FormData) {
  await requireAdmin();
  await db.application.delete({ where: { id: str(formData, "id") } });
  redirect("/admin/candidatures");
}
