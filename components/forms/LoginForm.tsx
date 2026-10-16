"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { ROLE_OPTIONS } from "@/constants/roles";
import { Login } from "@/types/login";
import { useAuthControllerLogin } from "@/app/api/endpoints";
import { useStorageStore } from "@/stores/storage";
import { LoginResponseDto } from "@/app/api/schemas";
import Cookies from "js-cookie";

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { setValue } = useStorageStore();
  const { mutateAsync: login, isPending } = useAuthControllerLogin();

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
      });

      setValue("user", response.user);

      router.push("/");
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

      <Form className=" mt-5!" requiredMark={false} onFinish={handleSubmit}>
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
            label="Email or ID"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="[email or user ID]"
            isRequird
          />
          <Input
            name="password"
            label="Password"
            type="password"
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

        {message && (
          <p
            role="status"
            className="mt-5 rounded-sm border border-border bg-foreground p-3 text-sm text-gray"
          >
            {message}
          </p>
        )}

        <Button type="submit" fullWidth className="mt-5">
          Sign in
        </Button>
        <p className="mt-5 text-center text-[13px] leading-6 text-gray">
          Need help? Contact <Button variant="link">UPCLASS</Button>
        </p>
      </Form>
    </div>
  );
}
