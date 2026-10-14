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
  LuReceiptText,
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
  { label: "Subjects", href: "/subjects", icon: LuBookOpen },
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
  { label: "Fee Structure", href: "/fee-structure", icon: LuReceiptText },
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
  {
    label: "Teacher Leaves",
    href: "/teacher-leaves",
    icon: LuCalendarDays,
  },
  { label: "Settings", href: "/settings", icon: LuSettings },
];
