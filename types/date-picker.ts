import type { Dayjs } from "dayjs";

export type DatePickerProps = {
  name: string | (string | number)[];
  label: string;
  isRequird?: boolean;
  pastOnly?: boolean;
  onChange?: (value: Dayjs | null) => void;
};
