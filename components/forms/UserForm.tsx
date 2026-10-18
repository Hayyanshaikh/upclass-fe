"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import { userStatusOptions } from "@/constants/users";
import type { UserAccount, UserFormValues } from "@/types/user-management";
import {
  getUserControllerFindAllQueryKey,
  getUserControllerFindOneQueryKey,
  useUserControllerUpdate,
} from "@/app/api/endpoints";
import type { UpdateUserDto } from "@/app/api/schemas";
import { useRoleDropdown } from "@/hooks/useRoleDropdown";

type UserFormProps = {
  user?: UserAccount;
};

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<UserFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    options,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useRoleDropdown();

  const { mutateAsync: updateUser, isPending } = useUserControllerUpdate();

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      name: user.name,
      role: user.role,
      email: user.email === "—" ? "" : user.email,
      status: user.isActive,
    });
  }, [form, user]);

  const handleSubmit = async (values: UserFormValues) => {
    if (!user || isPending) return;

    setSubmitError(null);
    const payload: UpdateUserDto = {
      name: values.name.trim(),
      email: values.email.trim(),
      roleId: values.role,
      isActive: values.status === "Active",
    };

    try {
      await updateUser({ data: payload, id: user.id });
      router.push("/users");
    } catch (error) {
      console.error(error);

      setSubmitError("Unable to update user. Please try again.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ status: "Active" }}
      onFinish={handleSubmit}
      onValuesChange={() => setSubmitError(null)}
      requiredMark={false}
      className="flex flex-col gap-6"
    >
      {submitError && <Alert type="error" role="alert" message={submitError} />}
      {rolesError && (
        <Alert type="warning" message="Unable to load role options." />
      )}
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
            options={options}
            placeholder="Select role"
            loading={rolesLoading}
            disabled={rolesError}
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
        <Button
          variant="secondary"
          disabled={isPending}
          onClick={() => router.push("/users")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isPending} disabled={!user}>
          {user ? "Update user" : "Add to preview"}
        </Button>
      </div>
    </Form>
  );
}
