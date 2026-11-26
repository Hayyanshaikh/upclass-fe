import type { Metadata } from "next";
import LeaveRequests from "@/components/leave-requests/LeaveRequests";
import MobileLeaveRequests from "@/components/mobile/leaves/MobileLeaveRequests";
import PlatformSwitch from "@/components/shared/PlatformSwitch";

export const metadata: Metadata = { title: "Leave requests | UPCLASS" };

export default function LeaveRequestsPage() {
  return (
    <PlatformSwitch
      desktop={<LeaveRequests />}
      mobile={<MobileLeaveRequests />}
    />
  );
}
