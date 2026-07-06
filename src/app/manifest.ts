import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "St. Xavier's Jr./Sr. School, Muzaffarpur",
    short_name: "St. Xavier's",
    description: "Where Discipline Meets Opportunity — CBSE Co-Ed School since 1976, Muzaffarpur",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#fdf6ec",
    theme_color: "#7a1c2f",
    categories: ["education", "school", "kids", "books"],
    icons: [
      { src: "/school/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/school/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/school/logo.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/school/logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Admissions",
        short_name: "Apply",
        description: "View admission process and apply",
        url: "/#admissions",
        icons: [{ src: "/school/logo.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Notices",
        short_name: "Notices",
        description: "View latest school notices",
        url: "/notices",
        icons: [{ src: "/school/logo.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Contact",
        short_name: "Contact",
        description: "Get in touch with the school",
        url: "/#contact",
        icons: [{ src: "/school/logo.png", sizes: "96x96", type: "image/png" }],
      },
    ],
  };
}
