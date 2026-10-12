export type CheckboxProps = {
  name: string | (string | number)[];
  label: string;
  disabled?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
};
