"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LuCalendarDays,
  LuCalendarRange,
  LuChevronRight,
  LuClock,
  LuGraduationCap,
  LuTreePalm,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileAcademicTermsSheet from "@/components/mobile/settings/MobileAcademicTermsSheet";
import MobileAcademicYearSheet from "@/components/mobile/settings/MobileAcademicYearSheet";
import MobileLeavePolicySheet from "@/components/mobile/settings/MobileLeavePolicySheet";
import MobilePeriodConfigSheet from "@/components/mobile/settings/MobilePeriodConfigSheet";
import MobileSchoolProfileSheet from "@/components/mobile/settings/MobileSchoolProfileSheet";
import type { User } from "@/stores/storage";
import { useStorageStore } from "@/stores/storage";

const SHEET_KEYS = [
  "profile",
  "academic",
  "terms",
  "periods",
  "leave",
] as const;

type SheetKey = (typeof SHEET_KEYS)[number];

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type SheetItem = {
  key: SheetKey;
  label: string;
  description: string;
  icon: IconType;
};

const SHEET_ITEMS: SheetItem[] = [
  {
    key: "profile",
    label: "School profile",
    description: "Logo, contact & working days",
    icon: LuGraduationCap,
  },
  {
    key: "academic",
    label: "Academic year",
    description: "Sessions, dates & status",
    icon: LuCalendarDays,
  },
  {
    key: "terms",
    label: "Academic terms",
    description: "Terms & year assignments",
    icon: LuCalendarRange,
  },
  {
    key: "periods",
    label: "Period configuration",
    description: "Periods, breaks & timings",
    icon: LuClock,
  },
  {
    key: "leave",
    label: "Leave policy",
    description: "Leave types & approval rules",
    icon: LuTreePalm,
  },
];

function sheetFromParam(value: string | null): SheetKey | null {
  return value && SHEET_KEYS.includes(value as SheetKey)
    ? (value as SheetKey)
    : null;
}

export default function MobileSettings() {
  const { values } = useStorageStore();
  const user = values.user as User | undefined;
  const schoolId = user?.school?.id ?? "";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeSheet, setActiveSheet] = useState<SheetKey | null>(() =>
    sheetFromParam(searchParams.get("tab")),
  );
  const [openedSheets, setOpenedSheets] = useState<ReadonlySet<SheetKey>>(
    () => {
      const initial = sheetFromParam(searchParams.get("tab"));
      return new Set(initial ? [initial] : []);
    },
  );
  const [focusWorkingDays] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#workingDays",
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function updateTabParam(key: SheetKey | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (key) {
      params.set("tab", key);
    } else {
      params.delete("tab");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function openSheet(key: SheetKey) {
    setOpenedSheets((previous) => new Set(previous).add(key));
    setActiveSheet(key);
    updateTabParam(key);
  }

  function closeSheet() {
    setActiveSheet(null);
    updateTabParam(null);

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }

  function handleFeedback(next: Feedback) {
    setFeedback(next);
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-lg font-bold text-dark">Settings</h1>

      <div className="flex flex-col gap-2">
        {SHEET_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => openSheet(item.key)}
            aria-label={item.label}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon size={20} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-dark">
                {item.label}
              </span>
              <span className="block truncate text-xs text-gray">
                {item.description}
              </span>
            </span>
            <LuChevronRight
              size={18}
              className="shrink-0 text-gray"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {openedSheets.has("profile") && (
        <MobileSchoolProfileSheet
          open={activeSheet === "profile"}
          schoolId={schoolId}
          focusWorkingDays={focusWorkingDays}
          onClose={closeSheet}
          onFeedback={handleFeedback}
        />
      )}
      {openedSheets.has("academic") && (
        <MobileAcademicYearSheet
          open={activeSheet === "academic"}
          schoolId={schoolId}
          onClose={closeSheet}
          onFeedback={handleFeedback}
        />
      )}
      {openedSheets.has("terms") && (
        <MobileAcademicTermsSheet
          open={activeSheet === "terms"}
          schoolId={schoolId}
          onClose={closeSheet}
          onFeedback={handleFeedback}
        />
      )}
      {openedSheets.has("periods") && (
        <MobilePeriodConfigSheet
          open={activeSheet === "periods"}
          schoolId={schoolId}
          onClose={closeSheet}
          onFeedback={handleFeedback}
        />
      )}
      {openedSheets.has("leave") && (
        <MobileLeavePolicySheet
          open={activeSheet === "leave"}
          schoolId={schoolId}
          onClose={closeSheet}
          onFeedback={handleFeedback}
        />
      )}

      <MobileFeedbackDialog
        open={feedback !== null}
        tone={feedback?.tone ?? "success"}
        message={feedback?.message ?? ""}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
