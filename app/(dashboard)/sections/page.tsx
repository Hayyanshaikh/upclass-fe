import type { Metadata } from "next";
import Sections from "@/components/sections/Sections";

export const metadata: Metadata = { title: "Sections | UPCLASS" };

export default function SectionsPage() {
  return <Sections />;
}
