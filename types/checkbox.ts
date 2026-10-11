export type CheckboxProps = {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
};
