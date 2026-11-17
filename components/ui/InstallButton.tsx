"use client";

import { useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import {
  type BeforeInstallPromptEvent,
  clearDeferredPrompt,
  getDeferredPrompt,
  getInstallSteps,
  isStandaloneMode,
  subscribeToInstallPrompt,
} from "@/lib/pwa-install";

export default function InstallButton() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");

    const checkInstalled = () => {
      setIsInstalled(isStandaloneMode());
    };

    const handleInstalled = () => {
      clearDeferredPrompt();
      setIsInstalled(true);
      setPromptEvent(null);
      setHelpOpen(false);
    };

    checkInstalled();

    const deferredPrompt = getDeferredPrompt();

    if (deferredPrompt) {
      setPromptEvent(deferredPrompt);
    }

    const unsubscribe = subscribeToInstallPrompt(setPromptEvent);

    window.addEventListener("appinstalled", handleInstalled);

    standaloneQuery.addEventListener("change", checkInstalled);

    return () => {
      unsubscribe();

      window.removeEventListener("appinstalled", handleInstalled);

      standaloneQuery.removeEventListener("change", checkInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (promptEvent) {
      try {
        await promptEvent.prompt();

        const { outcome } = await promptEvent.userChoice;

        if (outcome === "accepted") {
          setIsInstalled(true);
        }

        clearDeferredPrompt();
        setPromptEvent(null);
      } catch (error) {
        clearDeferredPrompt();
        setPromptEvent(null);
        console.error("Installation failed:", error);
      }

      return;
    }

    // iOS and browsers without native install prompt
    setHelpOpen(true);
  };

  if (isInstalled) return null;

  return (
    <>
      <div className="mt-2 shrink-0 px-1 [@media(display-mode:standalone)]:hidden">
        <button
          type="button"
          onClick={handleInstall}
          className="flex w-full items-center cursor-pointer gap-3 rounded-sm px-2.5 py-2 text-sm font-semibold text-light transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <LuDownload size={18} className="shrink-0" aria-hidden="true" />
          <span>Install App</span>
        </button>
      </div>

      <Dialog
        open={helpOpen}
        title="Install App"
        onClose={() => setHelpOpen(false)}
        onConfirm={() => setHelpOpen(false)}
        showPrimaryBtn={false}
        cancelText="Got it"
        width={440}
      >
        <p className="mb-3 text-sm text-dark">
          Install this app on your device for quick access.
        </p>

        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-dark">
          {getInstallSteps().map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Dialog>
    </>
  );
}
