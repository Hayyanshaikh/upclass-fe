import type { Teacher } from "@/types/teacher";

// Sample records until teacher endpoints are available.
export const teachers: Teacher[] = [
  { id: "T-014", name: "Sara Malik", subject: "Mathematics", classes: ["8-A", "9-C"], phone: "0300-0000000", employment: "Full-time", status: "Active" },
  { id: "T-021", name: "Omar Farooq", subject: "English", classes: ["6-B", "7-A"], phone: "0300-0000000", employment: "Full-time", status: "Active" },
  { id: "T-027", name: "Nadia Hussain", subject: "Science", classes: ["9-C", "10-A"], phone: "0300-0000000", employment: "Full-time", status: "On leave" },
  { id: "T-032", name: "Kamran Yousuf", subject: "Urdu", classes: ["7-A", "7-B"], phone: "0300-0000000", employment: "Part-time", status: "Active" },
  { id: "T-038", name: "Rabia Anwar", subject: "Computer", classes: ["8-A", "8-B"], phone: "0300-0000000", employment: "Full-time", status: "Active" },
  { id: "T-045", name: "Faisal Qureshi", subject: "Islamiyat", classes: ["6-A", "6-B"], phone: "0300-0000000", employment: "Contract", status: "Active" },
  { id: "T-048", name: "Amina Siddiqui", subject: "Mathematics", classes: ["6-A", "7-B"], phone: "0300-0000000", employment: "Full-time", status: "Active" },
  { id: "T-051", name: "Hassan Ali", subject: "Science", classes: ["8-A", "8-B"], phone: "0300-0000000", employment: "Part-time", status: "Active" },
  { id: "T-054", name: "Sana Ahmed", subject: "English", classes: ["9-A", "10-A"], phone: "0300-0000000", employment: "Contract", status: "On leave" },
  { id: "T-057", name: "Bilal Shah", subject: "Urdu", classes: ["6-A", "6-B"], phone: "0300-0000000", employment: "Full-time", status: "Inactive" },
  { id: "T-061", name: "Hina Raza", subject: "Computer", classes: ["9-C", "10-A"], phone: "0300-0000000", employment: "Part-time", status: "Active" },
  { id: "T-064", name: "Usman Akhtar", subject: "Islamiyat", classes: ["7-A", "8-A"], phone: "0300-0000000", employment: "Full-time", status: "Active" },
];

export const teacherSubjects = [...new Set(teachers.map((teacher) => teacher.subject))].sort();
export const teacherEmploymentOptions = ["Full-time", "Part-time", "Contract"].map((value) => ({ label: value, value }));
export const teacherStatusOptions = ["Active", "On leave", "Inactive"].map((value) => ({ label: value, value }));
export const teacherStatusVariants = {
  Active: "success",
  "On leave": "warning",
  Inactive: "neutral",
} as const;
