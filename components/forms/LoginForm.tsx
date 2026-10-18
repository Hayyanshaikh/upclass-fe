"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import Checkbox from "@/components/ui/Checkbox";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Login } from "@/types/login";
import { useAuthControllerLogin } from "@/app/api/endpoints";
import { useStorageStore } from "@/stores/storage";
import { LoginResponseDto } from "@/app/api/schemas";
import Cookies from "js-cookie";
import { useForm } from "antd/es/form/Form";

export default function LoginForm() {
  const [form] = useForm();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { setValue } = useStorageStore();
  const { mutateAsync: login, isPending } = useAuthControllerLogin({
    request: { unwrapResponse: true },
  });

  const handleSubmit = async (data: Login) => {
    try {
      const response: LoginResponseDto = await login({
        data: {
          email: data.email,
          password: data.password,
        },
      });

      Cookies.set("accessToken", response.accessToken, {
        expires: 1,
        path: "/",
      });

      setValue("user", response.user);

      router.push("/");

      form.resetFields();
      setMessage("");
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Invalid email or password.");
    }
  };

  return (
    <div className="w-full max-w-[486px] rounded-lg border border-border bg-white p-6 text-dark sm:p-8">
      <h2
        id="login-heading"
        className="text-[28px] leading-tight font-extrabold tracking-[-0.025em]"
      >
        Welcome back
      </h2>
      <p className="mt-1.5 text-sm text-gray">Sign in to your school portal</p>

      <Form
        form={form}
        className="mt-5!"
        requiredMark={false}
        onFinish={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          {/* <Select
            showSearch={false}
            name="role"
            label="Sign in as"
            options={ROLE_OPTIONS}
            placeholder="Select Role"
            isRequird
          /> */}
          <Input
            name="email"
            label="Email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Email"
            isRequird
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            isRequird
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Checkbox name="remember" label="Remember me" />
          <Button
            variant="link"
            onClick={() => router.push("/forgot-password")}
          >
            Forgot password?
          </Button>
        </div>

        {message && <Alert type="error" message={message} className="mt-5" />}

        <Button type="submit" fullWidth className="mt-5" loading={isPending}>
          Sign in
        </Button>
        <p className="mt-5 text-center text-[13px] leading-6 text-gray">
          Need help? Contact <Button variant="link">UPCLASS</Button>
        </p>
      </Form>
    </div>
  );
}
