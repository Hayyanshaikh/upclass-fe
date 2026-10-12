import type { Dayjs } from "dayjs";

export type DatePickerProps = {
  name: string;
  label: string;
  isRequird?: boolean;
  pastOnly?: boolean;
  onChange?: (value: Dayjs | null) => void;
};
