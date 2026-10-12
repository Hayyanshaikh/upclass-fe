export type BarChartItem = {
  label: string;
  value: number;
  variant?: "primary" | "secondary";
};

export type BarChartProps = {
  title: string;
  data: BarChartItem[];
  maxValue?: number;
  valueSuffix?: string;
  className?: string;
};
