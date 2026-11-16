import type { IconType } from "react-icons";

export type MetricTone = "primary" | "info" | "success" | "warning";

export type ActivityTone = "success" | "info" | "warning";

export type MobileMetric = {
  label: string;
  value: string;
  icon: IconType;
  tone: MetricTone;
};

export type MobileActivity = {
  id: string;
  title: string;
  meta: string;
  time: string;
  icon: IconType;
  tone: ActivityTone;
};

export type MobileAttendanceSummary = {
  percent: number;
  present: number;
  absent: number;
  onLeave: number;
};
