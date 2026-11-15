"use client";

import { useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function getInstallSteps() {
  if (typeof navigator === "undefined") {
    return [
      "Open your browser menu.",
      "Choose Install app or Add to Home Screen.",
      "Confirm the installation.",
    ];
  }

  const userAgent = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    return [
      "Tap the Share button in your browser.",
      "Choose Add to Home Screen.",
      "Tap Add.",
    ];
  }

  if (/Android/i.test(userAgent)) {
    return [
      "Open the browser menu (⋮).",
      "Tap Install app or Add to Home screen.",
      "Confirm the installation.",
    ];
  }

  if (
    /Safari/i.test(userAgent) &&
    !/Chrome|Chromium|Edg|OPR/i.test(userAgent)
  ) {
    return [
      "Open the File menu.",
      "Choose Add to Dock.",
      "Confirm the installation.",
    ];
  }

  return [
    "Click the install icon in the address bar, or open the browser menu.",
    "Choose Install app or Install this site as an app.",
    "Confirm the installation.",
  ];
}

export default function InstallButton() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) {
      setHelpOpen(true);
      return;
    }

    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    setPromptEvent(null);

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
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
