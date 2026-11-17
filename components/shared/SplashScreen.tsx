"use client";

import { useEffect, useState } from "react";
import { LuGraduationCap } from "react-icons/lu";

const SPLASH_KEY = "upclass:splash-shown";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    if (sessionStorage.getItem(SPLASH_KEY)) return;

    sessionStorage.setItem(SPLASH_KEY, "1");
    setVisible(true);

    const enterTimer = window.setTimeout(() => setEntered(true), 50);
    const leaveTimer = window.setTimeout(() => setLeaving(true), 1400);
    const hideTimer = window.setTimeout(() => setVisible(false), 1800);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Opening UPCLASS"
      className={`fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden bg-primary transition-opacity duration-[400ms] ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-white/[0.04]" />
        <div className="absolute -right-20 -bottom-24 size-72 rounded-full bg-secondary/10 blur-2xl" />
      </div>

      <div
        className={`relative flex size-24 items-center justify-center rounded-[28px] bg-secondary text-dark shadow-2xl shadow-black/25 ring-1 ring-white/20 transition-all duration-500 ease-out ${
          entered ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <LuGraduationCap size={48} aria-hidden="true" />
      </div>

      <p
        className={`relative mt-6 text-[26px] font-extrabold tracking-[0.14em] text-white transition-all delay-100 duration-500 ease-out ${
          entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        UPCLASS
      </p>
      <p
        className={`relative mt-1.5 text-[10px] font-semibold tracking-[0.24em] text-white/60 uppercase transition-all delay-150 duration-500 ease-out ${
          entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        School Management System
      </p>

      <span className="absolute inset-x-0 bottom-16 mx-auto h-1 w-24 overflow-hidden rounded-full bg-white/15">
        <span
          className={`block h-full rounded-full bg-secondary transition-[width] duration-[1200ms] ease-in-out ${
            entered ? "w-full" : "w-0"
          }`}
        />
      </span>
    </div>
  );
}
