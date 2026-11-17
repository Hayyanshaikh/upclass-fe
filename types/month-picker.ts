import type { Dayjs } from "dayjs";

export type MonthPickerProps = {
  name: string | (string | number)[];
  label?: string;
  isRequird?: boolean;
  onChange?: (value: Dayjs | null) => void;
};
