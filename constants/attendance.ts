import { students } from "@/constants/students";
import type { AttendanceEntries, AttendanceStatus, AttendanceStudent } from "@/types/attendance";
import type { SegmentedOption } from "@/types/segmented-control";

export const attendanceStatusOptions: SegmentedOption<AttendanceStatus>[] = [
  { label: "Present", value: "Present", variant: "primary" },
  { label: "Absent", value: "Absent", variant: "danger" },
  { label: "Late", value: "Late", variant: "warning" },
  { label: "Leave", value: "Leave", variant: "neutral" },
];

export const attendancePeriodOptions = [
  { label: "Full day", value: "full-day" },
  ...Array.from({ length: 6 }, (_, index) => ({ label: `Period ${index + 1}`, value: `period-${index + 1}` })),
];

// Additional sample students make the Class 8-A preview roster complete.
const previewNames = [
  "Maryam Tariq", "Daniyal Shah", "Zoya Siddiqui", "Hamza Nadeem", "Noor Fatima",
  "Saad Malik", "Hania Rauf", "Hassan Abbas", "Areeba Javed", "Ibrahim Ahmed",
  "Mahnoor Asif", "Rayan Ali", "Eman Saleem", "Fahad Iqbal", "Anaya Aslam",
  "Shahzaib Khan", "Saira Yousuf", "Huzaifa Raza", "Maira Anwar", "Abdullah Qasim",
  "Amna Rashid", "Affan Mirza", "Hafsa Waqar", "Talha Imran", "Alina Sohail",
  "Farhan Zafar", "Laiba Nasir", "Musa Kamal", "Sadia Khalid", "Ayan Saeed",
  "Zunaira Faisal", "Owais Akram", "Rida Waseem", "Shayan Asad", "Saba Haroon",
];

export const attendanceStudents: AttendanceStudent[] = [
  ...students.map(({ id, roll, name, className }) => ({ id, roll, name, className })),
  ...previewNames.map((name, index) => ({ id: String(2001 + index), roll: String(2001 + index), name, className: "8-A" })),
];

export const initialAttendance: AttendanceEntries = Object.fromEntries(
  attendanceStudents.filter((student) => student.className === "8-A").map((student) => {
    const status: AttendanceStatus = ["1013", "2002", "2010"].includes(student.id) ? "Absent"
      : ["2003", "2012"].includes(student.id) ? "Late" : student.id === "2004" ? "Leave" : "Present";
    const remarks = student.id === "1013" ? "Sick" : student.id === "2003" ? "Bus delay" : student.id === "2004" ? "Family event" : "";
    return [student.id, { status, remarks }];
  }),
);
