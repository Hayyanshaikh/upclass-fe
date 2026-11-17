import type { Metadata } from "next";
import PlatformSwitch from "@/components/shared/PlatformSwitch";
import Sections from "@/components/sections/Sections";
import MobileSections from "@/components/mobile/sections/MobileSections";

export const metadata: Metadata = { title: "Sections | UPCLASS" };

export default function SectionsRoute() {
  return <PlatformSwitch desktop={<Sections />} mobile={<MobileSections />} />;
}
