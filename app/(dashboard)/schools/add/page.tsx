import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import SchoolForm from "@/components/forms/SchoolForm";

export const metadata: Metadata = { title: "Add school | UPCLASS" };

export default function AddSchoolPage() {
  return (
    <div>
      {/* <PageHeader
        title="Add school"
        breadcrumbs={[
          { title: "Schools", href: "/schools" },
          { title: "Add school" },
        ]}
      /> */}
      <SchoolForm />
    </div>
  );
}
