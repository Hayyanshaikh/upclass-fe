import type { NavItem } from "@/types/menu";
import {
  LuLayoutDashboard,
  LuUsers,
  LuUserRound,
  LuBookOpen,
  LuClipboardCheck,
  LuUsersRound,
  LuCalendarDays,
  LuFileText,
  LuCreditCard,
  LuBell,
  LuSettings,
} from "react-icons/lu";

export const menuItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LuLayoutDashboard },
  {
    group: "People",
    label: "Students",
    href: "/students",
    icon: LuUsers,
  },
  { label: "Teachers", href: "/teachers", icon: LuUserRound },
  { label: "Classes", href: "/classes", icon: LuBookOpen },
  {
    group: "Attendance",
    label: "Student Attendance",
    href: "/attendance/students",
    icon: LuClipboardCheck,
  },
  {
    label: "Teacher Attendance",
    href: "/attendance/teachers",
    icon: LuUsersRound,
  },
  {
    group: "Academics",
    label: "Timetable",
    href: "/timetable",
    icon: LuCalendarDays,
  },
  { label: "Exams & Results", href: "/exams", icon: LuFileText },
  { group: "Finance", label: "Fees", href: "/fees", icon: LuCreditCard },
  {
    group: "Communication",
    label: "Notices",
    href: "/notices",
    icon: LuBell,
  },
  {
    group: "System",
    label: "Leave Requests",
    href: "/leave-requests",
    icon: LuCalendarDays,
    badge: 5,
  },
  { label: "Settings", href: "/settings", icon: LuSettings },
];

