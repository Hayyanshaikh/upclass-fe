import type { Metadata } from "next";
import MobileActions from "@/components/mobile/actions/MobileActions";

export const metadata: Metadata = { title: "All actions | UPCLASS" };

export default function ActionsPage() {
  return <MobileActions />;
}
