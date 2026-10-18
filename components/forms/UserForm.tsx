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
  useUserControllerCreate,
  useUserControllerUpdate,
} from "@/app/api/endpoints";
import type { CreateUserDto, UpdateUserDto } from "@/app/api/schemas";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import { useRoleDropdown } from "@/hooks/useRoleDropdown";

type UserFormProps = {
  user?: UserAccount;
};

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<UserFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { options, isLoading: rolesLoading, isError: rolesError } =
    useRoleDropdown();
  const { isSuperAdmin, isLoading: isCheckingRole } = useIsSuperAdmin();

  const { mutateAsync: createUser, isPending: isCreating } =
    useUserControllerCreate();
  const { mutateAsync: updateUser, isPending: isUpdating } =
    useUserControllerUpdate();
  const isPending = isCreating || isUpdating;

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
    if (isPending) return;
    if (!user && !isSuperAdmin) {
      setSubmitError("Only super admins can add users.");
      return;
    }

    setSubmitError(null);
    const fields = {
      name: values.name.trim(),
      email: values.email.trim(),
      roleId: values.role,
      isActive: values.status === "Active",
    };

    try {
      if (user) {
        const payload: UpdateUserDto = {
          ...fields,
          ...(isSuperAdmin && values.password
            ? { password: values.password }
            : {}),
        };
        await updateUser({ data: payload, id: user.id });
        void queryClient.invalidateQueries({
          queryKey: getUserControllerFindOneQueryKey(user.id),
        });
      } else {
        if (!values.password) return;
        const payload: CreateUserDto = {
          ...fields,
          password: values.password,
        };
        await createUser({ data: payload });
      }

      void queryClient.invalidateQueries({
        queryKey: getUserControllerFindAllQueryKey(),
      });
      router.push("/users");
    } catch (error) {
      if (isAxiosError(error)) {
        const body = error.response?.data as
          | { message?: string; data?: { errors?: string[] } }
          | undefined;
        const message = body?.data?.errors?.[0] ?? body?.message;

        if (error.response?.status === 409) {
          form.setFields([
            { name: "email", errors: [message ?? "Email already exists."] },
          ]);
          form.scrollToField("email", { focus: true });
          return;
        }

        setSubmitError(message ?? `Unable to ${user ? "update" : "add"} user.`);
        return;
      }

      setSubmitError(`Unable to ${user ? "update" : "add"} user.`);
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
      {!user && !isCheckingRole && !rolesError && !isSuperAdmin && (
        <Alert type="warning" message="Only super admins can add users." />
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
          {isSuperAdmin && (
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder={
                user ? "Leave blank to keep current password" : "Enter password"
              }
              autoComplete="new-password"
              isRequird={!user}
              rules={[
                { min: 8, message: "Password must be at least 8 characters." },
                { pattern: /\S/, message: "Password cannot be blank." },
              ]}
            />
          )}
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
        <Button
          type="submit"
          loading={isPending}
          disabled={
            !user &&
            (isCheckingRole || !isSuperAdmin || rolesLoading || rolesError)
          }
        >
          {user ? "Update user" : "Add user"}
        </Button>
      </div>
    </Form>
  );
}
