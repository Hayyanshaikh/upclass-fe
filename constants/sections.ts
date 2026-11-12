import type { SelectOption } from "@/types/select";
import { CreateSectionDtoStatus } from "@/app/api/schemas";
import { toOptions } from "@/utils/enum-options";

export const sectionStatusOptions: SelectOption[] = toOptions(
  CreateSectionDtoStatus,
  "default",
);

export const sectionFormDefaults = {
  status: "ACTIVE",
};
