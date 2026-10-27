import type { Metadata } from "next";
import { LuLockKeyhole } from "react-icons/lu";
import ErrorScreen from "@/components/shared/ErrorScreen";

export const metadata: Metadata = {
  title: "Access denied | UPCLASS",
  description: "You do not have access to this screen.",
};

export default function AccessDeniedPage() {
  return (
    <ErrorScreen
      code={403}
      title="Access Denied"
      description="You don't have permission to access this page."
      icon={<LuLockKeyhole size={42} />}
      actionLabel="Go back"
    />
  );
}
