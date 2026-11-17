"use client";

import { useEffect, useState } from "react";
import { LuCheck, LuDownload, LuGraduationCap } from "react-icons/lu";
import Button from "@/components/ui/Button";
import {
  type BeforeInstallPromptEvent,
  clearDeferredPrompt,
  getDeferredPrompt,
  getInstallSteps,
  isMobileDevice,
  isStandaloneMode,
  subscribeToInstallPrompt,
} from "@/lib/pwa-install";

const perks = [
  "One app for admins, teachers, students and parents",
  "Faster access straight from your home screen",
  "Secure sign-in for your school account",
];

export default function MobileInstallGate() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");

    const checkInstalled = () => {
      setIsInstalled(isStandaloneMode());
    };

    const handleInstalled = () => {
      clearDeferredPrompt();
      setPromptEvent(null);
      setIsInstalled(true);
      setShowSteps(false);
    };

    setMounted(true);
    setIsMobile(isMobileDevice());
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

  const isBlocked = mounted && isMobile && !isInstalled;

  useEffect(() => {
    if (!isBlocked) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isBlocked]);

  if (!isBlocked) return null;

  const handleInstall = async () => {
    if (!promptEvent) {
      setShowSteps(true);
      return;
    }

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
      setShowSteps(true);
      console.error("Installation failed:", error);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-gate-heading"
      className="fixed inset-0 z-[2000] overflow-y-auto overscroll-contain bg-background text-dark"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-52 left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#0f5c4d14,transparent_65%)]" />
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-secondary/[0.07] blur-2xl" />
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-sm flex-col px-6 py-8">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative flex size-40 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-primary/10" />
            <span className="absolute size-28 rounded-full bg-primary/[0.07] blur-xl" />
            <span className="relative flex size-20 items-center justify-center rounded-[24px] bg-secondary text-dark shadow-2xl shadow-secondary/40">
              <LuGraduationCap size={40} aria-hidden="true" />
            </span>
          </div>

          <p className="mt-8 text-[11px] font-bold tracking-[0.2em] text-primary/70 uppercase">
            UPCLASS Mobile
          </p>

          <h2
            id="install-gate-heading"
            className="mt-2 text-center text-[28px] leading-[1.15] font-extrabold tracking-[-0.03em]"
          >
            Install the app to continue
          </h2>
          <p className="mt-3 max-w-[19rem] text-center text-sm leading-5 text-gray">
            Get the full-screen UPCLASS experience right from your home screen.
          </p>

          <ul className="mx-auto mt-7 w-fit space-y-3 text-left">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-2.5 text-[13px] leading-5 font-semibold"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <LuCheck size={12} aria-hidden="true" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <Button
            fullWidth
            onClick={handleInstall}
            className="h-13! rounded-md! text-base! font-bold! shadow-lg! shadow-primary/25"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <LuDownload size={18} aria-hidden="true" />
              Install App
            </span>
          </Button>

          {showSteps && (
            <ol className="mt-4 list-decimal space-y-1.5 rounded-md border border-border bg-foreground py-3 pr-4 pl-8 text-xs leading-5 text-gray">
              {getInstallSteps().map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
