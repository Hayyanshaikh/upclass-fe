import type { SelectOption } from "@/types/select";
import { CreateSubjectDtoStatus, CreateSubjectDtoType } from "@/app/api/schemas";
import { toOptions } from "@/utils/enum-options";

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
  status: "ACTIVE",
  hasPractical: "No",
  totalMarks: 100,
  passingMarks: 40,
} satisfies Partial<{ status: string; hasPractical: string; totalMarks: number; passingMarks: number }>;
