"use client";

import { Form } from "antd";
import { LuBell } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import { useNotificationsSettings } from "@/hooks/useNotificationsSettings";
import type { SettingsTabProps } from "@/types/settings";

function NotificationRow({ name, label }: { name: string; label: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-sm border border-border px-4 py-3 text-sm font-semibold text-dark">
    <span>{label}</span>
    <Checkbox name={name} label="" ariaLabel={label} />
  </div>;
}

export default function NotificationsTab({
  registerTab,
  schoolId,
  onSave,
  isSaving,
}: SettingsTabProps) {
  const [form] = Form.useForm();
  useNotificationsSettings({ form, registerTab, schoolId });

  return (
    <Form form={form} layout="vertical">
      <SectionCard className="h-auto! min-h-full">
        <SectionTitle icon={LuBell}>Notifications</SectionTitle>
        <div className="space-y-2">
          <NotificationRow name="emailNotifications" label="Email notifications" />
          <NotificationRow name="smsNotifications" label="SMS notifications" />
          <NotificationRow name="leaveRequestAlert" label="New leave request alert" />
          <NotificationRow name="overdueReminders" label="Overdue fee reminders" />
          <NotificationRow name="examResultsPublished" label="Exam results published" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input name="senderEmail" label="Sender email" type="email" placeholder="[notifications@school.edu]" />
          <Input name="smsSenderId" label="SMS sender ID" placeholder="[SCHOOL]" />
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" loading={isSaving} onClick={onSave}>
            Save
          </Button>
        </div>
      </SectionCard>
    </Form>
  );
}
