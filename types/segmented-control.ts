export type SegmentedOption<T extends string> = {
  label: string;
  value: T;
  variant?: "primary" | "danger" | "warning" | "neutral";
};

export type SegmentedControlProps<T extends string> = {
  label: string;
  value?: T;
  options: SegmentedOption<T>[];
  onChange?: (value: T) => void;
};
