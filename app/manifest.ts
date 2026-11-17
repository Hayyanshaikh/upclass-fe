import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "UPCLASS",
    short_name: "UPCLASS",
    description:
      "School management platform — students, teachers, classes, exams, attendance, fees and more.",

    start_url: "/",
    scope: "/",
    display: "standalone",

    prefer_related_applications: false,

    background_color: "#ffffff",
    theme_color: "#0f5c4d",

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],

    screenshots: [
      {
        src: "/screenshots/mobile.png",
        sizes: "540x960",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/desktop.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
