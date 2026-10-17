"use client";

import { useEffect } from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import { userRoleOptions, userStatusOptions } from "@/constants/users";
import { useUserStore } from "@/stores/users";
import type { UserAccount, UserFormValues } from "@/types/user-management";

type UserFormProps = {
  user?: UserAccount;
};

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<UserFormValues>();
  const records = useUserStore((state) => state.records);
  const saveUser = useUserStore((state) => state.saveUser);

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      name: user.name,
      email: user.email === "—" ? "" : user.email,
      role: user.role,
      status: user.status,
    });
  }, [form, user]);

  function handleSubmit(values: UserFormValues) {
    const email = values.email.trim().toLowerCase();
    if (
      records.some(
        (record) =>
          record.email.toLowerCase() === email && record.id !== user?.id,
      )
    ) {
      form.setFields([
        { name: "email", errors: ["This email is already assigned to a user."] },
      ]);
      return;
    }

    saveUser(
      {
        id: user?.id ?? `USR-${Date.now()}`,
        name: values.name.trim(),
        email,
        role: values.role,
        status: values.status,
      },
      user?.id,
    );
    router.push("/users");
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ status: "Active" }}
      onFinish={handleSubmit}
      requiredMark={false}
      className="flex flex-col gap-6"
    >
      <SectionCard title="Account" autoHeight>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input
            name="name"
            label="Full name"
            placeholder="Enter full name"
            autoComplete="name"
            isRequird
          />
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="name@school.edu"
            autoComplete="email"
            isRequird
            rules={[
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            ]}
          />
          <Select
            name="role"
            label="Role"
            options={userRoleOptions}
            placeholder="Select role"
            isRequird
          />
          <Select
            name="status"
            label="Status"
            options={userStatusOptions}
            placeholder="Select status"
            isRequird
          />
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
        <p className="mr-auto text-xs text-gray">
          Preview changes are kept until the page is refreshed.
        </p>
        <Button variant="secondary" onClick={() => router.push("/users")}>
          Cancel
        </Button>
        <Button type="submit">
          {user ? "Update user" : "Add to preview"}
        </Button>
      </div>
    </Form>
  );
}
