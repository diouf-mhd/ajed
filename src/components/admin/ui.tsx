"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname();
  const active = href === "/admin" ? path === href : path.startsWith(href);
  return (
    <Link href={href} aria-current={active ? "page" : undefined}
      className={cn("whitespace-nowrap rounded-xl px-4 py-2.5 font-medium", active ? "bg-sun text-ink" : "text-white/85 hover:bg-white/10")}>
      {children}
    </Link>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn("btn-forest disabled:opacity-60", className)}>
      {pending ? "Enregistrement…" : children}
    </button>
  );
}

export function DeleteButton({ label = "Supprimer", confirmText = "Supprimer définitivement ?" }: { label?: string; confirmText?: string }) {
  return (
    <button type="submit" onClick={(e) => !confirm(confirmText) && e.preventDefault()}
      className="rounded-full border-2 border-red-600 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-600 hover:text-white">
      {label}
    </button>
  );
}

/** Zone de dépôt : glisser-déposer ou parcourir. Les fichiers partent avec le formulaire. */
export function DropZone({ name = "files", multiple = true }: { name?: string; multiple?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [names, setNames] = useState<string[]>([]);
  const [over, setOver] = useState(false);

  const sync = () => setNames(Array.from(input.current?.files ?? []).map((f) => f.name));

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault(); setOver(false);
        if (input.current) { input.current.files = e.dataTransfer.files; sync(); }
      }}
      className={cn("rounded-2xl border-2 border-dashed p-8 text-center transition-colors", over ? "border-forest bg-sun/20" : "border-black/25 bg-chalk")}
    >
      <UploadCloud className="mx-auto text-forest" size={36} aria-hidden />
      <p className="mt-2 font-semibold">Glissez vos photos ici</p>
      <label className="btn-line mt-3 cursor-pointer !py-2">
        Parcourir
        <input ref={input} type="file" name={name} multiple={multiple} accept="image/jpeg,image/png,image/webp,image/gif" required className="sr-only" onChange={sync} />
      </label>
      {names.length > 0 && <p className="mt-3 text-sm text-ink/70">{names.length} fichier(s) : {names.slice(0, 4).join(", ")}{names.length > 4 ? "…" : ""}</p>}
    </div>
  );
}
