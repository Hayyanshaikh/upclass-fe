"use client";

import { useEffect, useState } from "react";
import { Form, message } from "antd";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import AcademicYearTab from "@/components/settings/AcademicYearTab";
import FeeHeadsTab from "@/components/settings/FeeHeadsTab";
import LeavePolicyTab from "@/components/settings/LeavePolicyTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import RolesUsersTab from "@/components/settings/RolesUsersTab";
import SchoolProfileTab from "@/components/settings/SchoolProfileTab";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import {
  academicYears,
  feeHeads,
  leaveTypes,
  settingsUsers,
} from "@/constants/settings";
import type { AcademicYear, FeeHead, SettingsUser } from "@/types/settings";
import {
  useSchoolsControllerFindOne,
  useSchoolsControllerUpdate,
} from "@/app/api/endpoints";
import { useStorageStore } from "@/stores/storage";
import { UpdateSchoolDto } from "@/app/api/schemas";
import { handleImageUpload } from "@/utils/handle-image-upload";
import { isAxiosError } from "axios";
import ErrorDialog from "../shared/ErrorDialog";
import SuccessDialog from "../shared/SuccessDialog";

type DialogKind = "year" | "fee" | "user" | null;
type SavedSettings = {
  values: Record<string, unknown>;
  years: AcademicYear[];
  fees: FeeHead[];
  users: SettingsUser[];
};

const storageKey = "upclass-settings-demo";
// const initialValues = {
//   schoolName: "[School Name]",
//   shortCode: "SCH",
//   phone: "",
//   email: "",
//   website: "",
//   timeZone: "Asia/Karachi",
//   address: "",
//   academicYear: "2026",
//   terms: "2",
//   leaveTypes,
//   approvalRequired: "Yes",
//   carryForward: "No",
//   emailNotifications: true,
//   smsNotifications: false,
//   leaveRequestAlert: true,
//   overdueReminders: true,
//   examResultsPublished: true,
//   senderEmail: "notifications@school.edu",
//   smsSenderId: "SCHOOL",
// };

export default function Settings() {
  const router = useRouter();
  const { isSuperAdmin } = useIsSuperAdmin();
  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("profile");
  const [years, setYears] = useState(academicYears);
  const [fees, setFees] = useState(feeHeads);
  const [users, setUsers] = useState(settingsUsers);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const { values } = useStorageStore();
  const schoolId = values?.user?.school?.id ?? "";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as SavedSettings;
      form.setFieldsValue(parsed.values);
      setYears(parsed.years ?? academicYears);
      setFees(parsed.fees ?? feeHeads);
      setUsers(parsed.users ?? settingsUsers);
    } catch {
      message.error("Saved browser settings could not be loaded.");
    }
  }, [form]);

  const { mutateAsync: updateSchoolProfile, isPending: isUpdating } =
    useSchoolsControllerUpdate();

  async function saveSettings(values: any) {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const logo = await handleImageUpload(values.logo);

      const payload: UpdateSchoolDto = {
        name: values.schoolName,
        logo: logo.url ?? "",
        shortCode: values.shortCode,
        schoolType: values.schoolType,
        educationSystem: values.educationSystem,
        establishedYear: values.establishedYear
          ? Number(values.establishedYear)
          : undefined,
        description: values.description,
        phone: values.phone,
        email: values.email,
        address: values.address,
        principalName: values.principalName,
        vicePrincipalName: values.vicePrincipalName,
        adminContact: values.adminContact,
        ownerName: values.ownerName,
        dateFormat: values.dateFormat,
        feeDueDate: values.feeDueDate ? Number(values.feeDueDate) : undefined,
        workingDays: values.workingDays,
        openingTime: values.openingTime,
        closingTime: values.closingTime,
      };

      await updateSchoolProfile({
        id: schoolId,
        data: payload,
      });

      setSubmitSuccess("School settings updated successfully.");
    } catch (error: any) {
      const body = isAxiosError(error)
        ? (error.response?.data as
            | { message?: string; data?: { errors?: string[] } }
            | undefined)
        : undefined;

      const errorMessage =
        body?.data?.errors?.[0] ??
        body?.message ??
        (error instanceof Error ? error.message : undefined);

      setSubmitError(errorMessage ?? "Unable to update school settings.");
    }
  }

  function cancelChanges() {
    form.resetFields();
    setYears(academicYears);
    setFees(feeHeads);
    setUsers(settingsUsers);
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as SavedSettings;
      form.setFieldsValue(parsed.values);
      setYears(parsed.years ?? academicYears);
      setFees(parsed.fees ?? feeHeads);
      setUsers(parsed.users ?? settingsUsers);
    } catch {
      message.error("Saved browser settings could not be restored.");
    }
  }

  function openDialog(kind: Exclude<DialogKind, null>, user?: SettingsUser) {
    dialogForm.resetFields();
    setEditingUser(user?.id ?? null);
    if (user) dialogForm.setFieldsValue(user);
    setDialog(kind);
  }

  function submitDialog() {
    dialogForm
      .validateFields()
      .then((values) => {
        const id = editingUser ?? crypto.randomUUID();
        if (dialog === "year") {
          const year = String(values.year).trim();
          setYears((current) => [
            ...current,
            {
              id,
              year,
              duration: String(values.duration).trim(),
              status: "Closed",
            },
          ]);
        }
        if (dialog === "fee") {
          setFees((current) => [
            ...current,
            {
              id,
              name: String(values.name).trim(),
              required: values.required === "Yes",
              amount: Number(values.amount),
            },
          ]);
        }
        if (dialog === "user") {
          const record: SettingsUser = {
            id,
            name: String(values.name).trim(),
            role: String(values.role),
            email: String(values.email).trim(),
            status: "Active",
          };
          setUsers((current) =>
            editingUser
              ? current.map((user) => (user.id === editingUser ? record : user))
              : [...current, record],
          );
        }
        setDialog(null);
        message.info(
          "Change added locally. Use Save settings to keep it in this browser.",
        );
      })
      .catch(() => undefined);
  }

  const tabs = [
    {
      key: "profile",
      label: "School profile",
      children: <SchoolProfileTab form={form} schoolId={schoolId} />,
    },
    {
      key: "academic",
      label: "Academic year",
      children: (
        <AcademicYearTab years={years} onAdd={() => openDialog("year")} />
      ),
    },
    { key: "leave", label: "Leave policy", children: <LeavePolicyTab /> },
    {
      key: "fees",
      label: "Fee heads",
      children: <FeeHeadsTab fees={fees} onAdd={() => openDialog("fee")} />,
    },
    {
      key: "users",
      label: "Roles & users",
      children: (
        <RolesUsersTab
          users={users}
          onAdd={() => router.push("/users/add")}
          canAdd={isSuperAdmin}
          onEdit={(user) => openDialog("user", user)}
          onRemove={(id) =>
            setUsers((current) => current.filter((user) => user.id !== id))
          }
        />
      ),
    },
    {
      key: "notifications",
      label: "Notifications",
      children: <NotificationsTab />,
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
            <Button loading={isUpdating} onClick={() => form.submit()}>
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
      <Form
        form={form}
        layout="vertical"
        onFinish={saveSettings}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <Tabs
          items={tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          scrollable
        />
      </Form>
      <Dialog
        open={dialog !== null}
        title={
          dialog === "year"
            ? "Add academic year"
            : dialog === "fee"
              ? "Add fee head"
              : editingUser
                ? "Edit user"
                : "Add user"
        }
        okText={dialog === "user" && !editingUser ? "Add user" : "Add"}
        onClose={() => setDialog(null)}
        onConfirm={submitDialog}
      >
        <Form form={dialogForm} layout="vertical" className="space-y-4">
          {dialog === "year" && (
            <>
              <Input
                name="year"
                label="Academic year"
                isRequird
                placeholder="2027-28"
              />
              <Input
                name="duration"
                label="Duration"
                isRequird
                placeholder="Aug 2027 - Jun 2028"
              />
            </>
          )}
          {dialog === "fee" && (
            <>
              <Input name="name" label="Fee head" isRequird />
              <Input
                name="amount"
                label="Default amount (Rs.)"
                type="number"
                isRequird
              />
              <Select
                name="required"
                label="Required"
                isRequird
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
              />
            </>
          )}
          {dialog === "user" && (
            <>
              <Input name="name" label="Name" isRequird />
              <Input name="email" label="Email" type="email" isRequird />
              <Select
                name="role"
                label="Role"
                isRequird
                options={["Super admin", "Teacher", "Staff", "Viewer"].map(
                  (role) => ({ label: role, value: role }),
                )}
              />
            </>
          )}
        </Form>
      </Dialog>
    </div>
  );
}
