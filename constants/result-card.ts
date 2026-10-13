import { marksEntryGrades } from "@/constants/marks-entry";
import type { ResultCardDetails } from "@/types/result-card";

export const resultCardDefaultStudentId = "1012";
export const resultCardSchool = {
  name: "[School Name]",
  address: "[School address]",
  phone: "[Phone]",
};
export const resultCardSignatures = ["Class teacher", "Principal", "Guardian"];

const subjects = ["Mathematics", "English", "Science", "Urdu", "Computer", "Islamiyat"];

// Sample subject marks matching the totals shown on the results screen.
const studentCards = [
  { id: "1012", guardian: "Imran Khan", marks: [92, 88, 90, 85, 95, 84] },
  { id: "1052", guardian: "Tariq Ahmed", marks: [86, 82, 85, 80, 87, 82] },
  { id: "1058", guardian: "Faisal Shah", marks: [78, 80, 75, 77, 82, 76] },
  { id: "1066", guardian: "Nadeem Ahmed", marks: [72, 74, 68, 71, 76, 70] },
  { id: "1013", guardian: "Naveed Ahmed", marks: [62, 65, 58, 60, 67, 60] },
  { id: "1071", guardian: "Hussain Ali", marks: [32, 38, 35, 30, 42, 37] },
];

export const resultCards: Record<string, ResultCardDetails> = Object.fromEntries(
  studentCards.map((student) => [student.id, {
    guardian: student.guardian,
    className: "8-A",
    remarks: "[Remarks]",
    subjects: subjects.map((subject, index) => ({
      subject,
      total: 100,
      passing: 40,
      obtained: student.marks[index],
      grade: marksEntryGrades.find((grade) => student.marks[index] >= grade.minimum)?.label ?? "F",
    })),
  }]),
);
