"use server";

import { db } from "./db";

export type JoinState = { ok: boolean; message: string } | null;

export async function submitApplication(_prev: JoinState, formData: FormData): Promise<JoinState> {
  // Champ piège anti-spam : un humain ne le remplit pas.
  if (String(formData.get("website") ?? "")) return { ok: true, message: "Merci !" };

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().slice(0, 160);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const message = String(formData.get("message") ?? "").trim().slice(0, 2000);

  if (!name || !message) return { ok: false, message: "Indiquez votre nom et un message." };
  if (!email && !phone) return { ok: false, message: "Laissez un email ou un numéro pour qu'on puisse vous répondre." };

  await db.application.create({ data: { name, email: email || null, phone: phone || null, message } });
  return { ok: true, message: "Merci ! Nous revenons vers vous très vite." };
}
