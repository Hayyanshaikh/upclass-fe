"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import AcademicYearTab from "@/components/settings/AcademicYearTab";
import FeeHeadsTab from "@/components/settings/FeeHeadsTab";
import LeavePolicyTab from "@/components/settings/LeavePolicyTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import RolesUsersTab from "@/components/settings/RolesUsersTab";
import SchoolProfileTab from "@/components/settings/SchoolProfileTab";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
import type { User } from "@/stores/storage";
import { useStorageStore } from "@/stores/storage";
import type {
  RegisterSettingsTab,
  SettingsTabActions,
} from "@/types/settings";

function isValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

const TAB_KEYS = [
  "profile",
  "academic",
  "leave",
  "fees",
  "users",
  "notifications",
] as const;

type TabKey = (typeof TAB_KEYS)[number];

function resolveTab(value: string | null): TabKey {
  return TAB_KEYS.includes(value as TabKey) ? (value as TabKey) : "profile";
}

export default function Settings() {
  const { values } = useStorageStore();
  const user = values.user as User | undefined;
  const schoolId = user?.school?.id ?? "";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = resolveTab(searchParams.get("tab"));

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const handlersRef = useRef<Record<string, SettingsTabActions>>({});

  const registerTab = useCallback<RegisterSettingsTab>((key, actions) => {
    handlersRef.current[key] = actions;

    return () => {
      if (handlersRef.current[key] === actions) {
        delete handlersRef.current[key];
      }
    };
  }, []);

  async function saveSettings() {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSaving(true);

    try {
      const handlers = Object.values(handlersRef.current);
      await Promise.all(handlers.map((handler) => handler.validate()));
      await Promise.all(handlers.map((handler) => handler.save()));

      setSubmitSuccess("School settings updated successfully.");
    } catch (error) {
      if (isValidationError(error)) return;

      setSubmitError(
        error instanceof Error ? error.message : "Unable to update settings.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function cancelChanges() {
    Object.values(handlersRef.current).forEach((handler) => handler.reset());
  }

  function changeTab(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const tabs = [
    {
      key: "profile",
      label: "School profile",
      children: (
        <SchoolProfileTab registerTab={registerTab} schoolId={schoolId} />
      ),
    },
    {
      key: "academic",
      label: "Academic year",
      children: (
        <AcademicYearTab registerTab={registerTab} schoolId={schoolId} />
      ),
    },
    {
      key: "leave",
      label: "Leave policy",
      children: <LeavePolicyTab registerTab={registerTab} schoolId={schoolId} />,
    },
    {
      key: "fees",
      label: "Fee heads",
      children: <FeeHeadsTab registerTab={registerTab} schoolId={schoolId} />,
    },
    {
      key: "users",
      label: "Roles & users",
      children: <RolesUsersTab registerTab={registerTab} schoolId={schoolId} />,
    },
    {
      key: "notifications",
      label: "Notifications",
      children: (
        <NotificationsTab registerTab={registerTab} schoolId={schoolId} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={cancelChanges}>
              Cancel
            </Button>
            <Button loading={isSaving} onClick={saveSettings}>
              Save settings
            </Button>
          </div>
        }
      />
      <ErrorDialog
        open={submitError !== null}
        message={submitError ?? ""}
        onClose={() => setSubmitError(null)}
      />

      <SuccessDialog
        open={submitSuccess !== null}
        message={submitSuccess ?? ""}
        onClose={() => setSubmitSuccess(null)}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Tabs
          items={tabs}
          activeKey={activeTab}
          onChange={changeTab}
          scrollable
        />
      </div>
    </div>
  );
}
