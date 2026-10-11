"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import { LuArrowLeft, LuMail } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  function handleSubmit() {
    setMessage(
      "Password reset is not available yet. Please contact your school office for help.",
    );
  }

  return (
    <div className="w-full max-w-[486px] rounded-lg border border-border bg-white p-6 text-dark sm:p-8">
      <Button
        variant="link"
        className="mt-3 mb-6"
        onClick={() => router.push("/login")}
      >
        <LuArrowLeft size={18} aria-hidden="true" />
        Back to sign in
      </Button>

      <h2
        id="forgot-password-heading"
        className="text-[28px] leading-tight font-extrabold tracking-[-0.025em]"
      >
        Forgot password?
      </h2>
      <p className="mt-1.5 text-[13px] leading-5 text-gray">
        Enter your registered email or ID. We will send a link to reset your
        password.
      </p>

      <Form
        className="mt-5! [&_.ant-form-item]:mb-0! [&_.ant-form-item-label]:pb-1.5! [&_.ant-form-item-label>label]:text-[13px]!"
        requiredMark={false}
        onFinish={handleSubmit}
      >
        <Input
          name="identifier"
          label="Email or ID"
          placeholder="Email or user ID"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          isRequird
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Enter your registered email or ID",
            },
          ]}
        />
        <Button type="submit" fullWidth className="mt-5">
          Send reset link
        </Button>
      </Form>

      <div
        className="mt-5 flex items-start gap-3 rounded-sm bg-[#dceee8] p-4 text-[13px] leading-5 text-primary"
        role={message ? "status" : undefined}
      >
        <LuMail
          size={20}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <p className="font-medium">
          {message ||
            "If the account exists, a reset link will arrive in your inbox. It expires in 30 seconeds."}
        </p>
      </div>
    </div>
  );
}
