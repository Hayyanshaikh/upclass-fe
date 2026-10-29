import type { SelectOption } from "@/types/select";
import type { Subject } from "@/types/subject";
import { CreateSubjectDtoStatus, CreateSubjectDtoType } from "@/app/api/schemas";
import { toOptions } from "@/utils/enum-options";

export const subjects: Subject[] = [
  { id: "SUB-001", name: "Mathematics", code: "MATH", type: "Core", classes: 6, teachers: 4, status: "Active" },
  { id: "SUB-002", name: "English", code: "ENG", type: "Core", classes: 6, teachers: 3, status: "Active" },
  { id: "SUB-003", name: "Science", code: "SCI", type: "Core", classes: 5, teachers: 3, status: "Active" },
  { id: "SUB-004", name: "Urdu", code: "URD", type: "Core", classes: 6, teachers: 2, status: "Active" },
  { id: "SUB-005", name: "Computer", code: "COMP", type: "Core", classes: 4, teachers: 2, status: "Active" },
  { id: "SUB-006", name: "Islamiyat", code: "ISL", type: "Core", classes: 6, teachers: 2, status: "Active" },
  { id: "SUB-007", name: "Physical Ed.", code: "PE", type: "Core", classes: 3, teachers: 1, status: "Active" },
  { id: "SUB-008", name: "Art", code: "ART", type: "Core", classes: 1, teachers: 0, status: "Inactive" },
  { id: "SUB-009", name: "Social Studies", code: "SST", type: "Core", classes: 5, teachers: 2, status: "Active" },
  { id: "SUB-010", name: "Arabic", code: "ARA", type: "Core", classes: 4, teachers: 1, status: "Active" },
  { id: "SUB-011", name: "Geography", code: "GEO", type: "Core", classes: 4, teachers: 2, status: "Active" },
  { id: "SUB-012", name: "History", code: "HIS", type: "Core", classes: 4, teachers: 2, status: "Active" },
  { id: "SUB-013", name: "Biology", code: "BIO", type: "Core", classes: 3, teachers: 2, status: "Active" },
  { id: "SUB-014", name: "Chemistry", code: "CHEM", type: "Core", classes: 3, teachers: 1, status: "Active" },
  { id: "SUB-015", name: "Physics", code: "PHY", type: "Core", classes: 3, teachers: 1, status: "Active" },
  { id: "SUB-016", name: "Music", code: "MUS", type: "Core", classes: 1, teachers: 0, status: "Active" },
  { id: "SUB-017", name: "Drawing", code: "DRW", type: "Core", classes: 1, teachers: 1, status: "Active" },
  { id: "SUB-018", name: "Drama", code: "DRA", type: "Core", classes: 1, teachers: 1, status: "Active" },
];

export const subjectTypeOptions: SelectOption[] = toOptions(
  CreateSubjectDtoType,
  "default",
);

export const subjectStatusOptions: SelectOption[] = toOptions(
  CreateSubjectDtoStatus,
  "default",
);

export const practicalComponentOptions: SelectOption[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const subjectFormDefaults = {
  status: "Active",
  hasPractical: "No",
  totalMarks: 100,
  passingMarks: 40,
} satisfies Partial<Subject>;
