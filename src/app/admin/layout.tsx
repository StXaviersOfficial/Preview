import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — St. Xavier's Muzaffarpur",
  description: "Internal administration panel for St. Xavier's Jr./Sr. School staff.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
