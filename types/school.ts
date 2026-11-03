import type { SchoolDto } from "@/app/api/schemas";

export type SchoolFormValues = {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  status: string;
  adminName: string;
  adminEmail: string;
  adminPassword?: string;
};

export type SchoolFormProps = {
  school?: SchoolDto;
};
