import type { SectionDto } from "@/app/api/schemas";

export type SectionFormValues = {
  name: string;
  status: string;
};

export type SectionFormProps = {
  section?: SectionDto;
  onSaved?: () => Promise<unknown>;
};
