"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center">
      <h1 className="text-2xl font-bold text-forest">Une erreur est survenue</h1>
      <p className="mt-3 text-ink/70">{error.message || "Réessayez dans un instant."}</p>
      <button onClick={reset} className="btn-forest mt-6">Réessayer</button>
    </div>
  );
}
