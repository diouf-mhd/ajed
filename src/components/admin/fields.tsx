import { cn } from "@/lib/utils";

type Common = { label: string; name: string; hint?: string; className?: string };

export function Field({ label, name, hint, className, defaultValue, ...rest }: Common & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("block text-sm font-semibold", className)}>
      {label}
      <input name={name} defaultValue={defaultValue} className="input mt-1 font-normal" {...rest} />
      {hint && <span className="mt-1 block text-xs font-normal text-ink/60">{hint}</span>}
    </label>
  );
}

export function TextArea({ label, name, hint, className, rows = 4, defaultValue, ...rest }: Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={cn("block text-sm font-semibold", className)}>
      {label}
      <textarea name={name} rows={rows} defaultValue={defaultValue} className="input mt-1 font-normal" {...rest} />
      {hint && <span className="mt-1 block text-xs font-normal text-ink/60">{hint}</span>}
    </label>
  );
}

export function Select({ label, name, options, defaultValue, className }: Common & { options: { value: string; label: string }[]; defaultValue?: string }) {
  return (
    <label className={cn("block text-sm font-semibold", className)}>
      {label}
      <select name={name} defaultValue={defaultValue} className="input mt-1 font-normal">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "PUBLISHED", label: "Publié" },
];

/** Champ image : aperçu de l'existante (champ caché) + nouveau fichier. */
export function ImageField({ label, name, keepName, current }: { label: string; name: string; keepName: string; current?: string | null }) {
  return (
    <div className="text-sm font-semibold">
      <p>{label}</p>
      {current && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current} alt="" className="mt-2 h-28 w-auto rounded-xl object-cover" />
      )}
      <input type="hidden" name={keepName} defaultValue={current ?? ""} />
      <input type="file" name={name} accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block w-full text-sm font-normal file:mr-3 file:rounded-full file:border-0 file:bg-sun file:px-4 file:py-2 file:font-semibold" />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const pub = status === "PUBLISHED";
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", pub ? "bg-leaf/15 text-forest" : "bg-black/10 text-ink/70")}>
      {pub ? "Publié" : "Brouillon"}
    </span>
  );
}

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl font-extrabold text-forest">{title}</h1>
      {children}
    </div>
  );
}
