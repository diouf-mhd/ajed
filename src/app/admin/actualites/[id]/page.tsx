import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/NewsForm";
import { PageHeader } from "@/components/admin/fields";
import { db } from "@/lib/db";

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const news = await db.news.findUnique({ where: { id: (await params).id } });
  if (!news) notFound();
  return (<><PageHeader title="Modifier l'actualité" /><NewsForm news={news} /></>);
}
