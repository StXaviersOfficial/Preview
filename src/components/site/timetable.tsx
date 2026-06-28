'use client'

import { useEffect, useState } from "react";
import { Calendar, Clock, RefreshCw, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

type Entry = {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  classGrade: string;
  teacher?: string | null;
  room?: string | null;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function Timetable() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/timetable")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setEntries(d.entries);
        setLoading(false);
      })
      .catch(() => { setLoading(false); setError(true); });
  }, []);

  const classGrades = Array.from(new Set(entries.map((e) => e.classGrade)));
  const filtered = selectedClass ? entries.filter((e) => e.classGrade === selectedClass) : entries;
  const byDay = DAYS.map((day) => ({ day, periods: filtered.filter((e) => e.day === day).sort((a, b) => a.period - b.period) }));

  return (
    <section id="timetable" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-background to-cream">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8 sm:mb-12">
          <Reveal variant="up">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
            >
              <Calendar className="size-3.5 text-gold" />
              DAILY SCHEDULE • ACADEMIC SESSION 2026–27
            </div>
            <h2
              className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
            >
              Class <span className="text-gradient-xavier">timetable</span>.
            </h2>
          </Reveal>
          {/* Class selector */}
          {classGrades.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedClass(null)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  !selectedClass ? "bg-xavier-gradient text-cream" : "bg-card border border-xavier/10 text-foreground/70 hover:text-xavier-dark"
                }`}
              >
                All
              </button>
              {classGrades.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    selectedClass === c ? "bg-xavier-gradient text-cream" : "bg-card border border-xavier/10 text-foreground/70 hover:text-xavier-dark"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="size-4 animate-spin" /> Loading timetable…
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
            <Calendar className="size-10 mx-auto mb-3 text-gold/40" />
            <p>Timetable will be published shortly. Please check back later or contact the school office.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {byDay.map(({ day, periods }, dayIdx) => (
              <Reveal
                key={day}
                variant="elastic"
                delay={dayIdx * 0.05}
                className="rounded-2xl border border-xavier/10 bg-card overflow-hidden"
              >
                <div className="bg-xavier-gradient px-4 py-3 text-cream flex items-center justify-between">
                  <span className="font-serif font-bold text-sm">{day}</span>
                  <span className="text-[10px] uppercase tracking-widest text-cream/60">{periods.length} periods</span>
                </div>
                <div className="divide-y divide-xavier/5">
                  {periods.length === 0 ? (
                    <p className="px-4 py-4 text-xs text-muted-foreground text-center">No entries</p>
                  ) : (
                    periods.map((p) => (
                      <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                        <div className="shrink-0 size-9 rounded-lg bg-gold/15 text-gold font-serif font-bold text-xs flex flex-col items-center justify-center">
                          <span>P{p.period}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-xavier-dark truncate">{p.subject}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="size-2.5" />
                            {p.startTime} – {p.endTime}
                            {p.teacher && <span>• {p.teacher}</span>}
                            {p.room && <span>• {p.room}</span>}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          <ChevronRight className="size-3" />
          Timetable shown here is maintained live by the school office. For class-specific schedules, please contact the class teacher.
        </p>
      </div>
    </section>
  );
}
