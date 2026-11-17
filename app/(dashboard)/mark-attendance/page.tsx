import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import MarkAttendance from "@/components/attendance/MarkAttendance";
import MobileMarkAttendance from "@/components/mobile/attendance/MobileMarkAttendance";
import PageHeader from "@/components/shared/PageHeader";
import PlatformSwitch from "@/components/shared/PlatformSwitch";
import type { MarkAttendanceState } from "@/types/mark-attendance";

dayjs.extend(utc);
dayjs.extend(timezone);

export const metadata: Metadata = { title: "Mark attendance | UPCLASS" };

type MarkAttendancePageProps = {
  searchParams: Promise<{ state?: string | string[] }>;
};

const states: MarkAttendanceState[] = [
  "unchecked",
  "checked-in",
  "late",
  "leave",
  "completed",
];

async function MarkAttendanceContent({
  searchParams,
}: MarkAttendancePageProps) {
  await connection();
  const query = await searchParams;
  const requestedState = Array.isArray(query.state)
    ? query.state[0]
    : query.state;
  const initialState =
    states.find((state) => state === requestedState) ?? "checked-in";
  const today = dayjs().tz("Asia/Karachi").format("DD MMM YYYY");

  return (
    <PlatformSwitch
      desktop={
        <MarkAttendance
          key={initialState}
          initialState={initialState}
          today={today}
        />
      }
      mobile={
        <MobileMarkAttendance
          key={initialState}
          initialState={initialState}
          today={today}
        />
      }
    />
  );
}

export default function MarkAttendancePage({ searchParams }: MarkAttendancePageProps) {
  return (
    <Suspense
      fallback={
        <PlatformSwitch
          desktop={
            <PageHeader
              title="Mark attendance"
              subtitle="Check in when you arrive, check out when you leave"
            />
          }
          mobile={<h1 className="text-lg font-bold text-dark">Mark attendance</h1>}
        />
      }
    >
      <MarkAttendanceContent searchParams={searchParams} />
    </Suspense>
  );
}
