import { Mail, MapPin, Phone, MessageCircle, Facebook, Instagram } from "lucide-react";
import type { Settings } from "@/lib/data";

export function ContactInfo({ s }: { s: Settings }) {
  const items = [
    { icon: Phone, label: "Téléphone", value: s.phone, href: s.phone && `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: s.email, href: s.email && `mailto:${s.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: s.whatsapp, href: s.whatsapp && `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` },
    { icon: MapPin, label: "Localisation", value: s.address, href: "" },
    { icon: Facebook, label: "Facebook", value: s.facebook && "Page Facebook", href: s.facebook },
    { icon: Instagram, label: "Instagram", value: s.instagram && "Compte Instagram", href: s.instagram },
  ].filter((i) => i.value);

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map(({ icon: Icon, label, value, href }) => (
        <li key={label} className="flex items-start gap-4 rounded-2xl bg-chalk p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest text-white"><Icon size={20} aria-hidden /></span>
          <div>
            <p className="text-sm font-semibold text-leaf">{label}</p>
            {href ? (
              <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-medium text-forest underline-offset-4 hover:underline">{value}</a>
            ) : (
              <p className="font-medium text-forest">{value}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
