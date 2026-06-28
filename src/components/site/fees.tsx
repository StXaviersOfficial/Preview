'use client'

import { useEffect, useState } from "react";
import { Receipt, RefreshCw, Phone, ArrowRight } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";
import { Reveal } from "@/components/site/reveal";

type FeeRow = {
  id: string;
  label: string;
  amount: number;
  frequency: string;
  category: string;
  note?: string | null;
  order: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  lab: "Laboratory",
  hostel: "Hostel",
  transport: "Transport",
  exam: "Examination",
};

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-xavier/10 text-xavier-dark",
  lab: "bg-gold/15 text-gold",
  hostel: "bg-xavier-light/15 text-xavier-light",
  transport: "bg-gold-light/20 text-xavier-dark",
  exam: "bg-xavier/10 text-xavier-dark",
};

export function Fees() {
  const [rows, setRows] = useState<FeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/fees")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setRows(d.rows);
        setLoading(false);
      })
      .catch(() => { setLoading(false); setError(true); });
  }, []);

  const categories = Array.from(new Set(rows.map((r) => r.category)));
  const filtered = filter === "all" ? rows : rows.filter((r) => r.category === filter);
  const totalYearly = rows
    .filter((r) => r.frequency === "Yearly" || r.frequency === "Monthly" || r.frequency === "Quarterly")
    .reduce((sum, r) => {
      if (r.frequency === "Yearly") return sum + r.amount;
      if (r.frequency === "Quarterly") return sum + r.amount * 4;
      if (r.frequency === "Monthly") return sum + r.amount * 12;
      return sum;
    }, 0);

  return (
    <section id="fees" className="relative overflow-hidden py-16 sm:py-24 bg-cream-gradient">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <Reveal variant="up" className="max-w-3xl mb-8 sm:mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
          >
            <Receipt className="size-3.5 text-gold" />
            FEE STRUCTURE • ACADEMIC SESSION 2026–27
          </div>
          <h2
            className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
          >
            Transparent <span className="text-gradient-xavier">fee structure</span>.
          </h2>
          <p
            className="mt-4 text-sm sm:text-base text-muted-foreground"
          >
            All charges are listed below with no hidden costs. For class-specific variations, concessions, or sibling discounts, please contact the school office.
          </p>
        </Reveal>

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <button aria-label="Filter fees"
              onClick={() => setFilter("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === "all" ? "bg-xavier-gradient text-cream" : "bg-card border border-xavier/10 text-foreground/70 hover:text-xavier-dark"
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button aria-label="Filter fees"
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === c ? "bg-xavier-gradient text-cream" : "bg-card border border-xavier/10 text-foreground/70 hover:text-xavier-dark"
                }`}
              >
                {CATEGORY_LABELS[c] || c}
              </button>
            ))}
          </div>
        )}

        {/* Fee table */}
        {loading ? (
          <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="size-4 animate-spin" /> Loading fee structure…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
            <AlertCircle className="size-10 mx-auto mb-3 text-red-400" />
            <p>Failed to load fee structure. Please try again later.</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
            <Receipt className="size-10 mx-auto mb-3 text-gold/40" />
            <p>Fee details will be published shortly. Please contact the school office for the latest structure.</p>
          </div>
        ) : (
          <Reveal
            variant="scale"
            className="rounded-2xl border border-xavier/10 bg-card overflow-hidden"
          >
            {/* Header row — desktop only */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 bg-xavier/5 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              <div className="col-span-5">Particulars</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Frequency</div>
              <div className="col-span-3 text-right">Amount (₹)</div>
            </div>
            <div className="divide-y divide-xavier/5">
              {filtered.map((row, i) => (
                <Reveal
                  key={row.id}
                  variant="blur"
                  delay={i * 0.05}
                  className="px-5 py-3 grid grid-cols-12 gap-3 items-center hover:bg-cream/40 transition-colors"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <p className="font-semibold text-xavier-dark text-sm">{row.label}</p>
                    {row.note && <p className="text-[11px] text-muted-foreground mt-0.5">{row.note}</p>}
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[row.category] || "bg-xavier/10 text-xavier-dark"}`}>
                      {CATEGORY_LABELS[row.category] || row.category}
                    </span>
                  </div>
                  <div className="col-span-6 sm:col-span-2 text-xs text-muted-foreground">{row.frequency}</div>
                  <div className="col-span-12 sm:col-span-3 text-right font-serif font-bold text-xavier-dark tabular-nums">
                    ₹ {row.amount.toLocaleString('en-IN')}
                  </div>
                </Reveal>
              ))}
            </div>
            {/* Total */}
            {totalYearly > 0 && (
              <div className="px-5 py-4 bg-xavier-gradient text-cream flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-cream/60">Approx. Yearly Total</p>
                  <p className="text-[10px] text-cream/50">(excluding one-time fees)</p>
                </div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-gradient-gold tabular-nums">
                  ₹ {totalYearly.toLocaleString('en-IN')}
                </p>
              </div>
            )}
          </Reveal>
        )}

        {/* Contact CTA */}
        <Reveal
          variant="up"
          className="mt-5 rounded-2xl border border-xavier/10 bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="flex-1">
            <h3 className="font-serif text-base sm:text-lg font-bold text-xavier-dark">Have questions about fees or concessions?</h3>
            <p className="text-sm text-muted-foreground mt-1">Our office can clarify class-wise variations, sibling discounts, and instalment options.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SCHOOL.phones.slice(0, 2).map((p) => (
              <a key={p} href={`tel:+91${p}`} className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2.5 text-xs font-semibold text-cream">
                <Phone className="size-3.5" /> +91 {p}
              </a>
            ))}
            <a href="#contact" className="inline-flex items-center gap-1.5 rounded-full border border-xavier/20 px-4 py-2.5 text-xs font-semibold text-xavier-dark hover:bg-xavier/5 transition-colors">
              Enquire <ArrowRight className="size-3.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
