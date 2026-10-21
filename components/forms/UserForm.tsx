"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import { userStatusOptions } from "@/constants/users";
import { ROUTE_NAMES } from "@/constants/routes";
import type { UserAccount, UserFormValues } from "@/types/user-management";
import {
  useUserControllerCreate,
  useUserControllerUpdate,
} from "@/app/api/endpoints";
import type { CreateUserDto, UpdateUserDto } from "@/app/api/schemas";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import { useRoleDropdown } from "@/hooks/useRoleDropdown";

type UserFormProps = {
  user?: UserAccount;
  onSaved?: () => Promise<unknown>;
};

export default function UserForm({ user, onSaved }: UserFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<UserFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const {
    options,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useRoleDropdown();
  const { isSuperAdmin } = useIsSuperAdmin();

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

  useEffect(() => {
    if (user) return;
    return () => form.resetFields();
  }, [form, user]);

  const handleSubmit = async (values: UserFormValues) => {
    if (isPending) return;

    setSubmitError(null);
    setSubmitSuccess(null);
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
          ...(values.password ? { password: values.password } : {}),
        };
        await updateUser({ data: payload, id: user.id });
        await onSaved?.();
        setSubmitSuccess("User updated successfully.");
      } else {
        const payload: CreateUserDto = {
          ...fields,
          password: values.password ?? "",
        };
        const response = (await createUser({ data: payload })) as unknown as {
          data: { id: string };
        };
        setSuccessRedirect(
          ROUTE_NAMES.editUser.replace(
            ":id",
            encodeURIComponent(response.data.id),
          ),
        );
        setSubmitSuccess("User added successfully.");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const body = error.response?.data as
          | { message?: string; data?: { errors?: string[] } }
          | undefined;
        const message = body?.data?.errors?.[0] ?? body?.message;

        if (error.response?.status === 409) {
          setSubmitError(message ?? "Email already exists.");
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
    <div>
      <PageHeader
        title={user?.name ?? "Add user"}
        breadcrumbs={[
          { title: "Users", href: ROUTE_NAMES.userListing },
          { title: user ? "Edit user" : "Add user" },
        ]}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                if (!user) form.resetFields();
                router.push(ROUTE_NAMES.userListing);
              }}
            >
              Cancel
            </Button>
            <Button
              loading={isPending}
              disabled={!user && (rolesLoading || rolesError)}
              onClick={() => form.submit()}
            >
              {user ? "Update user" : "Add user"}
            </Button>
          </div>
        }
      />
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: "Active" }}
        onFinish={handleSubmit}
        onValuesChange={() => setSubmitError(null)}
        requiredMark={false}
        className="flex flex-col gap-6"
      >
        <ErrorDialog
          open={submitError !== null}
          message={submitError ?? ""}
          onClose={() => setSubmitError(null)}
        />
        <SuccessDialog
          open={submitSuccess !== null}
          message={submitSuccess ?? ""}
          onClose={() => {
            setSubmitSuccess(null);
            if (successRedirect) {
              router.push(successRedirect);
              setSuccessRedirect(null);
            }
          }}
        />
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
            {isSuperAdmin && (
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder={
                  user
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                autoComplete="new-password"
                isRequird={!user}
                rules={[
                  {
                    min: 8,
                    message: "Password must be at least 8 characters.",
                  },
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
      </Form>
    </div>
  );
}
