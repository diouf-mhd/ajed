"use client";

import { useActionState } from "react";
import { submitApplication, type JoinState } from "@/lib/public-actions";

export function JoinSection({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(submitApplication, null);

  return (
    <section id="rejoindre" className={compact ? "" : "bg-sun"}>
      <div className={compact ? "" : "wrap section grid gap-10 lg:grid-cols-2 lg:items-center"}>
        <div>
          <h2 className="h2 text-ink">Tu veux participer au changement de Dougar ?</h2>
          <p className="mt-4 max-w-md text-lg text-ink/80">
            Bénévole, porteur d&apos;idée ou simple curieux : il y a une place pour toi à l&apos;AJED.
          </p>
        </div>

        <form action={action} className="space-y-4 rounded-3xl bg-white p-6 shadow-xl sm:p-8" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Nom complet
              <input name="name" required autoComplete="name" className="input mt-1" />
            </label>
            <label className="block text-sm font-semibold">Téléphone / WhatsApp
              <input name="phone" type="tel" autoComplete="tel" className="input mt-1" />
            </label>
          </div>
          <label className="block text-sm font-semibold">Email
            <input name="email" type="email" autoComplete="email" className="input mt-1" />
          </label>
          <label className="block text-sm font-semibold">Ton message
            <textarea name="message" required rows={4} className="input mt-1" placeholder="Pourquoi veux-tu rejoindre l'AJED ?" />
          </label>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <button type="submit" disabled={pending} className="btn-forest w-full disabled:opacity-60">
            {pending ? "Envoi…" : "Rejoindre l'AJED"}
          </button>
          {state && (
            <p role="status" className={state.ok ? "font-semibold text-forest" : "font-semibold text-red-700"}>{state.message}</p>
          )}
        </form>
      </div>
    </section>
  );
}
