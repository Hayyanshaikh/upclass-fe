import type { Metadata } from "next";
import Notices from "@/components/notices/Notices";

export const metadata: Metadata = { title: "Notices | UPCLASS" };

export default function NoticesPage() {
  return <Notices />;
}
