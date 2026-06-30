import { PageLayout } from "@/components/site/page-layout";
import { Reveal } from "@/components/site/reveal";
import { Trophy, Medal, Star, Award, BookOpen, Flame } from "lucide-react";

export const metadata = {
  title: "Achievements",
  description: "Year-wise AISSCE toppers, sports achievements, Olympiad results, and competition wins at St. Xavier's Jr./Sr. School, Muzaffarpur.",
};

const TOPPERS = [
  { year: "2026", name: "Krishna Saraf", stream: "Science (PCM)", percentage: "97.2%", rank: "School Topper", highlight: true },
  { year: "2026", name: "Priya Kumari", stream: "Commerce", percentage: "94.8%", rank: "Commerce Topper" },
  { year: "2026", name: "Aditya Raj", stream: "Science (PCB)", percentage: "93.5%", rank: "PCB Topper" },
  { year: "2025", name: "Sneha Gupta", stream: "Science (PCM)", percentage: "96.4%", rank: "School Topper", highlight: true },
  { year: "2025", name: "Rohit Verma", stream: "Commerce", percentage: "93.2%", rank: "Commerce Topper" },
  { year: "2024", name: "Ananya Singh", stream: "Arts", percentage: "95.6%", rank: "School Topper", highlight: true },
  { year: "2024", name: "Vikram Mishra", stream: "Science (PCM)", percentage: "94.1%", rank: "Science Topper" },
  { year: "2023", name: "Shreya Pandey", stream: "Science (PCB)", percentage: "95.8%", rank: "School Topper", highlight: true },
];

const SPORTS_ACHIEVEMENTS = [
  { event: "District Swimming Championship", year: "2026", achievement: "Gold Medal — U-16 Boys", name: "Arnav Kumar" },
  { event: "CBSE Cluster Basketball Tournament", year: "2025", achievement: "Quarter-Finalist", name: "School Team" },
  { event: "District Athletics Meet", year: "2025", achievement: "Silver Medal — 100m Sprint", name: "Puja Raj" },
  { event: "Inter-School Cricket Tournament", year: "2024", achievement: "Runner-Up", name: "School Team" },
  { event: "State Yoga Championship", year: "2024", achievement: "Bronze Medal — U-14 Girls", name: "Riya Singh" },
  { event: "District Table Tennis", year: "2023", achievement: "Gold Medal — U-16 Girls", name: "Anshika Verma" },
];

const OLYMPIAD_RESULTS = [
  { exam: "National Science Olympiad (NSO)", year: "2026", achievement: "3 students in top 1% nationally", level: "Level 2" },
  { exam: "International Mathematics Olympiad (IMO)", year: "2025", achievement: "5 Gold medals, 12 students qualified Level 2", level: "Level 2" },
  { exam: "English Olympiad (IEO)", year: "2025", achievement: "2 students in state top 10", level: "Level 2" },
  { exam: "National Cyber Olympiad (NCO)", year: "2024", achievement: "School rank 1 achieved by 4 students", level: "Level 1" },
];

const OTHER_ACHIEVEMENTS = [
  { title: "100% AISSCE Result", desc: "Consistent 100% pass rate in Class 12 board exams for the last 5 years.", icon: BookOpen },
  { title: "80+ Awards", desc: "Over 80 awards won across academics, sports, and cultural competitions since 1976.", icon: Award },
  { title: "Youth Parliament", desc: "Winners at the district-level Youth Parliament competition for 3 consecutive years.", icon: Trophy },
  { title: "Science Exhibition", desc: "Multiple state-level science exhibition qualifiers and winners.", icon: Star },
];

export default function AchievementsPage() {
  return (
    <PageLayout
      badge="EXcellence IN ACTION"
      title={<>Our <span className="text-gradient-xavier">Achievements</span></>}
      subtitle="Nearly five decades of academic excellence, sporting triumphs, and all-round achievement. Here's what our students have accomplished."
    >
      {/* AISSCE Toppers */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal variant="up" className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="size-6 text-gold" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">AISSCE Toppers — Year-wise</h2>
            </div>
            <p className="text-sm text-muted-foreground">Class 12 board examination toppers over the years</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPPERS.map((t, i) => (
              <Reveal
                key={`${t.year}-${t.name}`}
                variant="elastic"
                delay={i * 0.04}
                className={`rounded-2xl border p-5 ${t.highlight ? "border-gold/40 bg-gradient-to-br from-gold/8 to-xavier/5" : "border-xavier/10 bg-card"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.highlight ? "bg-gold-gradient text-xavier-dark" : "bg-xavier/10 text-xavier-dark"}`}>
                    {t.year}
                  </span>
                  {t.highlight && <Flame className="size-4 text-gold" />}
                </div>
                <p className="font-serif text-lg font-bold text-xavier-dark">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.stream}</p>
                <p className="font-serif text-2xl font-bold text-gradient-xavier mt-3">{t.percentage}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{t.rank}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Achievements */}
      <section className="py-16 sm:py-20 bg-cream-gradient">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal variant="up" className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Medal className="size-6 text-gold" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">Sports Achievements</h2>
            </div>
            <p className="text-sm text-muted-foreground">Victories at district, state, and inter-school levels</p>
          </Reveal>

          <div className="space-y-3">
            {SPORTS_ACHIEVEMENTS.map((s, i) => (
              <Reveal key={`${s.event}-${s.year}`} variant="wave" delay={i * 0.04}>
                <div className="flex items-center gap-4 rounded-2xl border border-xavier/10 bg-card p-4 sm:p-5">
                  <div className="size-12 rounded-xl bg-xavier-gradient flex items-center justify-center shrink-0">
                    <Medal className="size-5 text-gold-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-xavier-dark text-sm sm:text-base">{s.event}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{s.achievement} — {s.name}</p>
                  </div>
                  <span className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full shrink-0">{s.year}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Olympiad Results */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal variant="up" className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Star className="size-6 text-gold" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">Olympiad Results</h2>
            </div>
            <p className="text-sm text-muted-foreground">National and international academic olympiad achievements</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {OLYMPIAD_RESULTS.map((o, i) => (
              <Reveal key={`${o.exam}-${o.year}`} variant="scale" delay={i * 0.04}>
                <div className="rounded-2xl border border-xavier/10 bg-card p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif font-bold text-xavier-dark text-sm sm:text-base">{o.exam}</h3>
                    <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-1 rounded-full shrink-0">{o.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{o.achievement}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Year: {o.year}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Other Achievements */}
      <section className="py-16 sm:py-20 bg-xavier-dark text-cream">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal variant="up" className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream">More to Celebrate</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OTHER_ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.title} variant="explode" delay={i * 0.05}>
                <div className="rounded-2xl glass-dark p-5 text-center">
                  <div className="mx-auto mb-3 size-12 rounded-xl bg-gold-gradient flex items-center justify-center">
                    <a.icon className="size-5 text-xavier-dark" />
                  </div>
                  <h3 className="font-serif font-bold text-cream text-sm mb-1">{a.title}</h3>
                  <p className="text-xs text-cream/70">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
