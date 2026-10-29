import type { SubjectDto } from "@/app/api/schemas";

// Adapter: map API SubjectDto to the local Subject shape expected by forms/dialogs.
export interface Subject extends SubjectDto {
  classes?: number;
  teachers?: number;
}

export type SubjectFormValues = {
  name: string;
  code: string;
  type: string;
  status: string;
  hasPractical: "Yes" | "No";
  totalMarks: number;
  passingMarks: number;
};

export type SubjectFormProps = {
  subject?: SubjectDto;
  onSaved?: () => Promise<unknown>;
};
