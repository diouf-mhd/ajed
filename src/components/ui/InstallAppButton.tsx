"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type InstallChoice = { outcome: "accepted" | "dismissed"; platform: string };

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const updateInstalled = () => {
      const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
      setInstalled(standalone.matches || iosStandalone);
    };
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    updateInstalled();
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    standalone.addEventListener("change", updateInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      standalone.removeEventListener("change", updateInstalled);
    };
  }, []);

  async function install() {
    if (!installPrompt) {
      setShowInstructions((visible) => !visible);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  }

  if (installed) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={install}
        aria-expanded={showInstructions}
        aria-haspopup="dialog"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-forest px-3 text-sm font-semibold text-forest transition-colors hover:bg-chalk sm:px-4"
      >
        <Download size={17} aria-hidden />
        <span>Installer</span>
      </button>
      {showInstructions && (
        <div role="dialog" aria-label="Installer l'application AJED" className="absolute right-0 top-12 z-50 w-[min(19rem,calc(100vw-2.5rem))] rounded-xl bg-white p-4 text-sm text-ink shadow-xl ring-1 ring-black/10">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-forest">Installer AJED</p>
            <button type="button" onClick={() => setShowInstructions(false)} aria-label="Fermer" className="-mr-2 -mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-chalk">
              <X size={17} aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-ink/75">
            {isIos
              ? "Dans Safari, touchez Partager, puis « Sur l’écran d’accueil »."
              : "Ouvrez le menu de votre navigateur, puis choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil »."}
          </p>
        </div>
      )}
    </div>
  );
}
