"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/server-actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-semibold">Mot de passe
        <input name="password" type="password" required autoComplete="current-password" className="input mt-1" />
      </label>
      <button type="submit" disabled={pending} className="btn-forest w-full disabled:opacity-60">{pending ? "Connexion…" : "Se connecter"}</button>
      {state?.error && <p role="alert" className="font-semibold text-red-700">{state.error}</p>}
    </form>
  );
}
