'use client';

import { useState } from "react";
import { Reveal } from "@/components/site/reveal";
import { Calendar, AlertCircle, Bell, Search, X } from "lucide-react";

type Notice = {
  id: string;
  title: string;
  category: "General" | "Holiday" | "Exam" | "Admission" | "Event" | "Circular";
  date: string;
  priority: "high" | "medium" | "low";
  summary: string;
};

const CATEGORIES = ["All", "Admission", "Exam", "Holiday", "Event", "Circular", "General"] as const;

const CATEGORY_STYLES: Record<string, string> = {
  Admission: "bg-gold/15 text-gold",
  Exam: "bg-red-500/15 text-red-600 dark:text-red-400",
  Holiday: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Event: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Circular: "bg-xavier/15 text-xavier-dark",
  General: "bg-xavier/15 text-xavier-dark",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "border-l-4 border-l-red-500",
  medium: "border-l-4 border-l-gold",
  low: "border-l-4 border-l-xavier/30",
};

function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function NoticesList({ notices }: { notices: Notice[] }) {
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = notices
    .filter((n) => filter === "All" ? true : n.category === filter)
    .filter((n) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q);
    });

  return (
    <>
      {/* Search box */}
      <div className="relative max-w-xl mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notices…"
          aria-label="Search notices"
          className="w-full rounded-full border border-xavier/15 bg-card pl-11 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-xavier/30 focus:border-xavier/40 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-xavier/10 hover:bg-xavier/20 flex items-center justify-center text-xavier-dark transition-colors"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Category filter — functional */}
      <Reveal variant="scale" className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const count = cat === "All" ? notices.length : notices.filter((n) => n.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === cat
                  ? "bg-xavier-gradient text-cream-fg shadow-glow-xavier"
                  : "bg-xavier/8 text-xavier-dark hover:bg-xavier/15"
              }`}
            >
              {cat} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </Reveal>

      {/* Notices list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
          <Bell className="size-10 mx-auto mb-3 text-gold/40" />
          {search ? (
            <>
              <p className="text-sm">No notices match &ldquo;{search}&rdquo;.</p>
              <button
                onClick={() => setSearch("")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-xs font-semibold text-cream-fg"
              >
                Clear search
              </button>
            </>
          ) : (
            <p>No notices in this category. Check back soon!</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n, i) => (
            <Reveal key={n.id} variant="up" delay={Math.min(i * 0.03, 0.3)}>
              <div className={`rounded-2xl border border-xavier/10 bg-card p-5 ${PRIORITY_STYLES[n.priority]}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${CATEGORY_STYLES[n.category]}`}>
                      {n.category}
                    </span>
                    {n.priority === "high" && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-red-500">
                        <AlertCircle className="size-3" /> Important
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                    <Calendar className="size-3" /> {formatDate(n.date)}
                  </span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-xavier-dark mb-1">{n.title}</h3>
                <p className="text-sm text-foreground/75 leading-relaxed">{n.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Info note */}
      <Reveal variant="blur" className="mt-8">
        <div className="rounded-2xl bg-xavier-gradient p-5 text-cream-fg text-center">
          <Bell className="size-6 mx-auto mb-2 text-gold-light" />
          <p className="text-sm">
            For older notices or specific circulars, please contact the school office.
            <br />
            <span className="text-xs text-cream-fg/70">Notices are updated regularly — bookmark this page.</span>
          </p>
        </div>
      </Reveal>
    </>
  );
}
