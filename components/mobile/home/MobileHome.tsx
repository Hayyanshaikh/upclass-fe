import HomeStats from "@/components/mobile/home/HomeStats";
import QuickActions from "@/components/mobile/home/QuickActions";
import AttendanceOverview from "@/components/mobile/home/AttendanceOverview";
import RecentActivity from "@/components/mobile/home/RecentActivity";
import UpcomingTimetable from "@/components/mobile/home/UpcomingTimetable";

export default function MobileHome() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">Dashboard</h1>
      <HomeStats />
      <QuickActions />
      {/* <AttendanceOverview />
      <RecentActivity />
      <UpcomingTimetable /> */}
    </div>
  );
}
