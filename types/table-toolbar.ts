import type { SelectOption } from "@/types/select";
import type { Dayjs } from "dayjs";

export type TableSearch = {
  placeholder?: string;
  onChange: (value: string) => void;
};

export type SelectFilterField = {
  type?: "select";
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  allowClear?: boolean;
  onChange?: (value: string | undefined) => void;
};

export type DateFilterField = {
  type: "date";
  name: string;
  label: string;
  value?: Dayjs | null;
  pastOnly?: boolean;
  onChange?: (value: Dayjs | null) => void;
};

export type FilterField = SelectFilterField | DateFilterField;

export type TableAction = {
  label: string;
  variant?: "primary" | "secondary" | "link";
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export type TableToolbarProps = {
  search?: TableSearch;
  showSearch?: boolean;
  filterFields?: FilterField[];
  actions?: TableAction[];
};
