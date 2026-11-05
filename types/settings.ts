import type { ReactNode } from "react";
import type { IconType } from "react-icons";

export type SectionTitleProps = {
  icon: IconType;
  children: ReactNode;
  action?: ReactNode;
};

export type AcademicYear = {
  id: string;
  year: string;
  duration: string;
  status: "Active" | "Closed";
};

export type LeaveType = {
  id: string;
  name: string;
  days: number;
};

export type FeeHead = {
  id: string;
  name: string;
  required: boolean;
  amount: number;
};

export type SettingsUser = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "Active" | "Inactive";
};

export type SettingsTabActions = {
  validate: () => Promise<void>;
  save: () => Promise<void>;
  reset: () => void;
};

export type RegisterSettingsTab = (
  key: string,
  actions: SettingsTabActions,
) => () => void;

export type SettingsTabProps = {
  registerTab: RegisterSettingsTab;
  schoolId: string;
};
