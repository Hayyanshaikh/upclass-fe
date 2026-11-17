import PlatformSwitch from "@/components/shared/PlatformSwitch";
import MobileSettings from "@/components/mobile/settings/MobileSettings";
import Settings from "@/components/settings/Settings";

export default function SettingsPage() {
  return <PlatformSwitch desktop={<Settings />} mobile={<MobileSettings />} />;
}
