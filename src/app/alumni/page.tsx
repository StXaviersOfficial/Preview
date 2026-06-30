import { PageLayout } from "@/components/site/page-layout";
import { Reveal } from "@/components/site/reveal";
import { Quote, GraduationCap, Briefcase, Heart } from "lucide-react";

export const metadata = {
  title: "Alumni Network",
  description: "St. Xavier's Jr./Sr. School, Muzaffarpur — our alumni across the world. Stories, achievements, and where they are now.",
};

const ALUMNI = [
  {
    name: "Dr. Ankit Raj",
    batch: "2010",
    now: "Cardiologist, AIIMS Delhi",
    stream: "Science (PCB)",
    quote: "Xavier's gave me the discipline that got me through medical school. The biology labs here were better equipped than my first year of MBBS.",
    initials: "AR",
  },
  {
    name: "Priya Singh",
    batch: "2012",
    now: "Software Engineer, Google Bangalore",
    stream: "Science (PCM)",
    quote: "The computer science faculty at Xavier's was ahead of its time. I still remember the coding workshops in Class 11 — that's where my tech journey began.",
    initials: "PS",
  },
  {
    name: "Vikram Choudhary",
    batch: "2008",
    now: "IAS Officer, Bihar Cadre",
    stream: "Arts",
    quote: "The values education and youth parliament debates at Xavier's shaped my interest in public service. I owe my civil services career to this school.",
    initials: "VC",
  },
  {
    name: "Dr. Shreya Verma",
    batch: "2011",
    now: "Research Scientist, ISRO",
    stream: "Science (PCM)",
    quote: "My physics teacher at Xavier's, Mr. Sharma, made me fall in love with the subject. Today I build satellites. That journey started in a Class 9 classroom.",
    initials: "SV",
  },
  {
    name: "Rohit Agarwal",
    batch: "2013",
    now: "CA, Founder — Agarwal & Associates",
    stream: "Commerce",
    quote: "The Commerce stream at Xavier's was rigorous but never rigid. Our Accounts sir refused to let us memorise — he made us understand. That foundation built my career.",
    initials: "RA",
  },
  {
    name: "Ananya Pandey",
    batch: "2015",
    now: "Architect, Mumbai",
    stream: "Science (PCM)",
    quote: "Xavier's believed in all-round development. I was equally encouraged in academics and in art class. Today I'm an architect — both sides of my education matter.",
    initials: "AP",
  },
  {
    name: "Saurabh Kumar",
    batch: "2009",
    now: "Lt. Colonel, Indian Army",
    stream: "Science (PCM)",
    quote: "The discipline drilled into me at Xavier's — assemblies, uniform inspections, punctuality — prepared me for NDA and the Army. I'm forever grateful.",
    initials: "SK",
  },
  {
    name: "Neha Kumari",
    batch: "2014",
    now: " Advocate, Patna High Court",
    stream: "Arts",
    quote: "The debating culture at Xavier's — youth parliament, elocution competitions — gave me the confidence to pursue law. I still use those skills every day in court.",
    initials: "NK",
  },
];

const BATCHES = [
  { decade: "1976-1985", count: "120+", note: "Founding decade" },
  { decade: "1986-1995", count: "350+", note: "Growing legacy" },
  { decade: "1996-2005", count: "500+", note: "Expansion era" },
  { decade: "2006-2015", count: "800+", note: "Modern era" },
  { decade: "2016-2026", count: "1000+", note: "Current generation" },
];

export default function AlumniPage() {
  return (
    <PageLayout
      badge="OUR EXTENDED FAMILY"
      title={<>The <span className="text-gradient-xavier">Alumni</span> Network</>}
      subtitle="Nearly five decades of Xavierites — making their mark across India and the world. Once a Xavierite, always a Xavierite."
    >
      {/* Stats */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal variant="up" className="mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink text-center">Alumni by the Decade</h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BATCHES.map((b, i) => (
              <Reveal key={b.decade} variant="elastic" delay={i * 0.05}>
                <div className="rounded-2xl border border-xavier/10 bg-card p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{b.decade}</p>
                  <p className="font-serif text-2xl font-bold text-gradient-xavier mt-1">{b.count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Stories */}
      <section className="py-12 sm:py-16 bg-cream-gradient">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal variant="up" className="mb-8">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-6 text-gold" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">Where Are They Now?</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Stories from Xavierites across the decades</p>
          </Reveal>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
            {ALUMNI.map((a, i) => (
              <Reveal key={a.name} variant="wave" delay={i * 0.04} className="break-inside-avoid">
                <div className="rounded-2xl border border-xavier/10 bg-card p-5">
                  <Quote className="size-6 text-gold/40 mb-3" />
                  <blockquote className="text-sm text-foreground/85 leading-relaxed font-serif italic mb-4">
                    {a.quote}
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-xavier-gradient flex items-center justify-center font-serif font-bold text-gold-light text-sm shrink-0">
                      {a.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xavier-dark text-sm">{a.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="size-3" /> {a.now}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        Batch of {a.batch} • {a.stream}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-4xl px-5 sm:px-6">
          <Reveal variant="scale">
            <div className="rounded-3xl bg-xavier-gradient p-6 sm:p-10 text-cream text-center">
              <Heart className="size-8 mx-auto mb-3 text-gold-light" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2">Are you a Xavierite?</h3>
              <p className="text-sm text-cream/80 max-w-md mx-auto mb-5">
                We'd love to hear from you. Share your story, reconnect with classmates, and mentor current students.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-xavier-dark shadow-glow-gold"
              >
                Get in Touch
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageLayout>
  );
}
