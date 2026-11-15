"use client";

import { useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
};

// Captured at module load because Chrome may fire the event before React hydrates.
let deferredPromptEvent: BeforeInstallPromptEvent | null = null;

const promptSubscribers = new Set<(event: BeforeInstallPromptEvent) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    const promptEvent = event as BeforeInstallPromptEvent;

    deferredPromptEvent = promptEvent;
    promptSubscribers.forEach((subscriber) => subscriber(promptEvent));
  });
}

function isIOSDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function getInstallSteps() {
  if (isIOSDevice()) {
    return [
      "Tap the Share button in Safari.",
      "Choose Add to Home Screen.",
      "Tap Add to install the app.",
    ];
  }

  if (/Android/i.test(navigator.userAgent)) {
    return [
      "Open the browser menu (⋮).",
      "Choose Install app or Add to Home screen.",
      "Confirm the installation.",
    ];
  }

  return [
    "Click the install icon in the browser address bar.",
    "Choose Install app.",
    "Confirm the installation.",
  ];
}

export default function InstallButton() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");

    const checkInstalled = () => {
      const standalone =
        standaloneQuery.matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;

      setIsInstalled(standalone);
    };

    const handlePrompt = (event: BeforeInstallPromptEvent) => {
      setPromptEvent(event);
    };

    const handleInstalled = () => {
      deferredPromptEvent = null;
      setIsInstalled(true);
      setPromptEvent(null);
      setHelpOpen(false);
    };

    checkInstalled();

    if (deferredPromptEvent) {
      setPromptEvent(deferredPromptEvent);
    }

    promptSubscribers.add(handlePrompt);

    window.addEventListener("appinstalled", handleInstalled);

    standaloneQuery.addEventListener("change", checkInstalled);

    return () => {
      promptSubscribers.delete(handlePrompt);

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

        deferredPromptEvent = null;
        setPromptEvent(null);
      } catch (error) {
        deferredPromptEvent = null;
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
