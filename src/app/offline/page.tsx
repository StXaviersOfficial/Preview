import OfflineContent from "./offline-content";

export const metadata = {
  title: "Offline",
  description: "You are currently offline. Please check your internet connection.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return <OfflineContent />;
}
