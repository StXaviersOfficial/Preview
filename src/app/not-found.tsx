import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-gradient px-5">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 relative">
          <p className="font-serif text-7xl sm:text-9xl font-bold text-gradient-xavier">404</p>
          <div className="absolute -top-2 -right-2 size-12 rounded-full bg-gold/20 blur-2xl" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-xavier-dark mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-foreground/70 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Don&apos;t worry — let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-xavier-gradient px-6 py-3 text-sm font-semibold text-cream-fg shadow-glow-xavier hover:scale-105 transition-transform"
          >
            <Home className="size-4" />
            Back to Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border border-xavier/20 px-6 py-3 text-sm font-semibold text-xavier-dark hover:bg-xavier/5 transition-colors"
          >
            <Search className="size-4" />
            Contact Us
          </Link>
        </div>
        <div className="mt-10 pt-6 border-t border-xavier/10 text-xs text-muted-foreground">
          <p>St. Xavier&apos;s Jr./Sr. School • Muzaffarpur</p>
          <p className="mt-1">
            <Link href="/" className="hover:text-xavier-dark transition-colors">Home</Link>
            {" • "}
            <Link href="/achievements" className="hover:text-xavier-dark transition-colors">Achievements</Link>
            {" • "}
            <Link href="/faculty" className="hover:text-xavier-dark transition-colors">Faculty</Link>
            {" • "}
            <Link href="/notices" className="hover:text-xavier-dark transition-colors">Notices</Link>
            {" • "}
            <Link href="/alumni" className="hover:text-xavier-dark transition-colors">Alumni</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
