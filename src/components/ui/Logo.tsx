import { cn } from "@/lib/utils";

/** Affiche le logo officiel : public/logo-ajed.png (remplacez le fichier par votre logo). */
export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo-ajed.png" alt="Logo AJED" width={56} height={56} className={cn("h-12 w-12 object-contain", className)} />
  );
}
