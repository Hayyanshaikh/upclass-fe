export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
};

// Captured at module load because Chrome may fire the event before React hydrates.
let deferredPrompt: BeforeInstallPromptEvent | null = null;

const promptSubscribers = new Set<(event: BeforeInstallPromptEvent) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    const promptEvent = event as BeforeInstallPromptEvent;

    deferredPrompt = promptEvent;
    promptSubscribers.forEach((subscriber) => subscriber(promptEvent));
  });
}

export function getDeferredPrompt() {
  return deferredPrompt;
}

export function subscribeToInstallPrompt(
  subscriber: (event: BeforeInstallPromptEvent) => void,
) {
  promptSubscribers.add(subscriber);

  return () => {
    promptSubscribers.delete(subscriber);
  };
}

export function clearDeferredPrompt() {
  deferredPrompt = null;
}

export function isStandaloneMode() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isMobileDevice() {
  if (typeof navigator === "undefined") return false;

  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isIOSDevice() {
  if (typeof navigator === "undefined") return false;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function getInstallSteps() {
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
