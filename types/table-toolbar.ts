import type { SelectOption } from "@/types/select";

export type TableSearch = {
  placeholder?: string;
  onChange: (value: string) => void;
};

export type FilterField = {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  onChange: (value: string | undefined) => void;
};

export type TableAction = {
  label: string;
  variant?: "primary" | "secondary" | "link";
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export type TableToolbarProps = {
  search?: TableSearch;
  filterFields?: FilterField[];
  actions?: TableAction[];
};
