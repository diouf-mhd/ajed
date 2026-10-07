import { cn } from "@/lib/utils";

/** Image avec repli visuel (dégradé vert) quand aucune photo n'est définie. */
export function Img({
  src,
  alt,
  className,
  priority = false,
  fit = "cover",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("bg-gradient-to-br from-forest via-forest-700 to-leaf", className)}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(fit === "contain" ? "object-contain" : "object-cover", className)}
    />
  );
}
