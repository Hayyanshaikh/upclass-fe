import type { Metadata } from "next";
import ApplyLeaveForm from "@/components/teacher-leaves/ApplyLeaveForm";

export const metadata: Metadata = { title: "Apply leave | UPCLASS" };

export default function ApplyLeavePage() {
  return <ApplyLeaveForm />;
}
