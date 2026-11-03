import type { Metadata } from "next";
import ClassForm from "@/components/forms/ClassForm";

export const metadata: Metadata = { title: "Add class | UPCLASS" };

export default function AddClassRoute() {
  return <ClassForm />;
}
