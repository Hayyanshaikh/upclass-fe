import type { Metadata } from "next";
import SectionForm from "@/components/forms/SectionForm";

export const metadata: Metadata = { title: "Add section | UPCLASS" };

export default function AddSectionRoute() {
  return <SectionForm />;
}
