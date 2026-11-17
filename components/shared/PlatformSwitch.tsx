"use client";

import type { ReactNode } from "react";

type PlatformSwitchProps = {
  desktop: ReactNode;
  mobile: ReactNode;
};

export default function PlatformSwitch({
  desktop,
  mobile,
}: PlatformSwitchProps) {
  return (
    <>
      <div className="hidden h-full md:block">{desktop}</div>
      <div className="block md:hidden">{mobile}</div>
    </>
  );
}
