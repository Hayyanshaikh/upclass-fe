export type SwitchProps = {
  checked: boolean;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onChange: (checked: boolean) => void;
};
