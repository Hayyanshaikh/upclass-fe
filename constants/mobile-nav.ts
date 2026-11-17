import {
  LuAlignLeft,
  LuClipboardCheck,
  LuCreditCard,
  LuEllipsis,
  LuHouse,
  LuUsers,
} from "react-icons/lu";
import type { NavItem } from "@/types/menu";

export const mobileNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: LuHouse, permission: "dashboard.view" },
  {
    label: "Students",
    href: "/students",
    icon: LuUsers,
    permission: "students.view",
  },
  {
    label: "Attendance",
    href: "/attendance/students",
    icon: LuClipboardCheck,
    permission: "student_attendance.view",
  },
  {
    label: "Fees",
    href: "/fees",
    icon: LuCreditCard,
    permission: "fees.view",
  },
  {
    label: "More",
    href: "/actions",
    icon: LuAlignLeft,
    permission: "settings.view",
  },
];
