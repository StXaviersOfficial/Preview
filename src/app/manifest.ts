import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "St. Xavier's Jr./Sr. School, Muzaffarpur",
    short_name: "St. Xavier's",
    description: "Where Discipline Meets Opportunity — CBSE Co-Ed School since 1976, Muzaffarpur",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf6ec",
    theme_color: "#7a1c2f",
    icons: [
      { src: "/school/logo.png", sizes: "192x192", type: "image/png" },
      { src: "/school/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
