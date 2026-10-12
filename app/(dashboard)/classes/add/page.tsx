import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import ClassForm from "@/components/forms/ClassForm";

export const metadata: Metadata = { title: "Add class | UPCLASS" };

export default function AddClassPage() {
  return (
    <div>
      <PageHeader title="Add class" breadcrumbs={[{ title: "Classes", href: "/classes" }, { title: "Add class" }]} />
      <ClassForm />
    </div>
  );
}
