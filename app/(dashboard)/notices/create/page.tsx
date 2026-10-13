import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import NoticeForm from "@/components/forms/NoticeForm";

export const metadata: Metadata = { title: "Create notice | UPCLASS" };

export default function CreateNoticePage() {
  return (
    <div>
      <PageHeader title="Create notice" breadcrumbs={[{ title: "Notices", href: "/notices" }, { title: "Create" }]} />
      <NoticeForm />
    </div>
  );
}
