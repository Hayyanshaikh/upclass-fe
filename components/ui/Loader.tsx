"use client";

import { Spin } from "antd";
import { Suspense } from "react";

type LoaderProps = {
  tip?: string;
  fullscreen?: boolean;
  size?: "small" | "medium" | "large";
};

export default function Loader({
  tip = "Loading...",
  fullscreen = true,
  size = "medium",
}: LoaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: fullscreen ? "80vh" : "200px",
      }}
    >
      <Suspense fallback={<div>{tip}</div>}>
        <Spin size={size} description={tip} />
      </Suspense>
    </div>
  );
}
