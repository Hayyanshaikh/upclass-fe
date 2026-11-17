import {
  LuBanknote,
  LuBookOpen,
  LuCalendarClock,
  LuCircleCheck,
  LuLayers,
  LuLayoutGrid,
  LuUserPlus,
  LuUserRound,
  LuUsers,
} from "react-icons/lu";
import type {
  MobileActivity,
  MobileAttendanceSummary,
  MobileMetric,
} from "@/types/mobile-dashboard";
import type { NavItem } from "@/types/menu";

// Preview data until dashboard endpoints are available.
export const mobileMetrics: MobileMetric[] = [
  { label: "Students", value: "1,248", icon: LuUsers, tone: "primary" },
  { label: "Teachers", value: "64", icon: LuUserRound, tone: "info" },
  { label: "Classes", value: "32", icon: LuLayoutGrid, tone: "success" },
  // {
  //   label: "Pending leaves",
  //   value: "7",
  //   icon: LuCalendarClock,
  //   tone: "warning",
  // },
];

export const quickActions: NavItem[] = [
  {
    label: "Students",
    href: "/students",
    icon: LuUsers,
    permission: "students.view",
  },
  {
    label: "Teachers",
    href: "/teachers",
    icon: LuUserRound,
    permission: "teachers.view",
  },
  {
    label: "Classes",
    href: "/classes",
    icon: LuLayoutGrid,
    permission: "classes.view",
  },
  {
    label: "Sections",
    href: "/sections",
    icon: LuLayers,
    permission: "sections.view",
  },
  {
    label: "Subjects",
    href: "/subjects",
    icon: LuBookOpen,
    permission: "subjects.view",
  },
  {
    label: "Mark att.",
    href: "/mark-attendance",
    icon: LuCalendarClock,
    permission: "mark_attendance.create",
  },
];

export const todayAttendance: MobileAttendanceSummary = {
  percent: 94,
  present: 1173,
  absent: 71,
  onLeave: 4,
};

export const recentActivities: MobileActivity[] = [
  {
    id: "fee",
    title: "Fee payment received",
    meta: "Ayesha Khan · Class 6-B · Rs. 12,500",
    time: "9:24",
    icon: LuBanknote,
    tone: "success",
  },
  {
    id: "enrolled",
    title: "New student enrolled",
    meta: "Hamza Ali · Class 8-A",
    time: "8:40",
    icon: LuUserPlus,
    tone: "info",
  },
  {
    id: "leave",
    title: "Leave request approved",
    meta: "Bilal Ahmed · Sick leave",
    time: "8:05",
    icon: LuCircleCheck,
    tone: "warning",
  },
];
