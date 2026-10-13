export type CheckboxProps = {
  name: string | (string | number)[];
  label: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
};
