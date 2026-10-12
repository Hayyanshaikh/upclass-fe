export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectRule = {
  required?: boolean;
  message?: string;
};

export type SelectProps = {
  name: string | (string | number)[];
  label?: string;
  rules?: SelectRule[];
  isRequird?: boolean;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  showSearch?: boolean;
  allowClear?: boolean;
  className?: string;
  onChange?: (value: string | undefined) => void;
};
