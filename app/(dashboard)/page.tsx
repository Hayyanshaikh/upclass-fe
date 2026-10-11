import type { Metadata } from "next";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Dashboard | UPCLASS",
  description: "School overview, attendance and fees.",
};

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" />

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="School statistics"
      >
        <StatCard
          title="Total students"
          value="1,248"
          description="+32 this term"
        />
        <StatCard
          title="Teaching staff"
          value="64"
          description="3 on leave today"
        />
        <StatCard
          title="Attendance today"
          value="94%"
          description="71 absent"
          variant="warning"
        />
        <StatCard
          title="Fees pending"
          value="Rs. 0"
          description="86 students"
          variant="warning"
        />
      </section>
    </div>
  );
}
