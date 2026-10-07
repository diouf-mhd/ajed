import { cn } from "@/lib/utils";

export function SectionTitle({
  title,
  intro,
  light = false,
  className,
}: {
  title: string;
  intro?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <h2 className={cn("h2", light ? "text-white" : "text-forest")}>{title}</h2>
      {intro && <p className={cn("mt-4 text-lg", light ? "text-white/80" : "text-ink/70")}>{intro}</p>}
    </div>
  );
}
