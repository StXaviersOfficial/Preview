import { PageLayout } from "@/components/site/page-layout";
import { Reveal } from "@/components/site/reveal";
import { GraduationCap, BookOpen, FlaskConical, Calculator, Palette, Globe2, Award, Users } from "lucide-react";

export const metadata = {
  title: "Faculty Directory",
  description: "Meet the dedicated teachers of St. Xavier's Jr./Sr. School, Muzaffarpur — department-wise listing of our 71+ skilled educators.",
};

const DEPARTMENTS = [
  {
    name: "Science",
    icon: FlaskConical,
    color: "from-emerald-500/10 to-teal-500/10",
    head: "Dr. R. Sharma",
    headQual: "M.Sc., Ph.D. (Physics) — 18 years",
    members: [
      { name: "Mr. A. Verma", qual: "M.Sc. (Chemistry)", exp: "12 years" },
      { name: "Mrs. S. Pandey", qual: "M.Sc. (Biology)", exp: "15 years" },
      { name: "Mr. K. Mishra", qual: "M.Sc. (Physics)", exp: "8 years" },
      { name: "Ms. P. Raj", qual: "M.Sc. (Chemistry)", exp: "6 years" },
      { name: "Mr. R. Singh", qual: "M.Sc. (Biology)", exp: "10 years" },
    ],
  },
  {
    name: "Mathematics",
    icon: Calculator,
    color: "from-blue-500/10 to-indigo-500/10",
    head: "Mr. S. Choudhary",
    headQual: "M.Sc. (Maths) — 20 years",
    members: [
      { name: "Mrs. N. Kumari", qual: "M.Sc. (Maths)", exp: "14 years" },
      { name: "Mr. D. Prasad", qual: "M.Sc. (Maths)", exp: "9 years" },
      { name: "Ms. R. Gupta", qual: "M.Sc. (Maths)", exp: "5 years" },
    ],
  },
  {
    name: "English",
    icon: BookOpen,
    color: "from-purple-500/10 to-pink-500/10",
    head: "Mrs. M. Anthony",
    headQual: "M.A. (English), B.Ed. — 22 years",
    members: [
      { name: "Mr. J. Tigga", qual: "M.A. (English)", exp: "11 years" },
      { name: "Ms. A. Khan", qual: "M.A. (English)", exp: "7 years" },
      { name: "Mrs. C. Lal", qual: "M.A. (English)", exp: "9 years" },
    ],
  },
  {
    name: "Hindi & Sanskrit",
    icon: Globe2,
    color: "from-orange-500/10 to-amber-500/10",
    head: "Dr. S. Jha",
    headQual: "M.A. (Hindi), Ph.D. — 25 years",
    members: [
      { name: "Mr. R. Thakur", qual: "M.A. (Hindi)", exp: "13 years" },
      { name: "Mrs. K. Devi", qual: "M.A. (Sanskrit)", exp: "10 years" },
    ],
  },
  {
    name: "Social Science",
    icon: Globe2,
    color: "from-rose-500/10 to-red-500/10",
    head: "Mr. P. Singh",
    headQual: "M.A. (History), B.Ed. — 16 years",
    members: [
      { name: "Mrs. A. Mishra", qual: "M.A. (Geography)", exp: "8 years" },
      { name: "Mr. V. Kumar", qual: "M.A. (Pol. Sci.)", exp: "6 years" },
    ],
  },
  {
    name: "Commerce",
    icon: Calculator,
    color: "from-green-500/10 to-emerald-500/10",
    head: "Mr. A. Prasad",
    headQual: "M.Com., B.Ed. — 19 years",
    members: [
      { name: "Mrs. S. Agarwal", qual: "M.Com.", exp: "10 years" },
      { name: "Mr. R. Gupta", qual: "MBA, M.Com.", exp: "7 years" },
    ],
  },
  {
    name: "Computer Science",
    icon: FlaskConical,
    color: "from-cyan-500/10 to-blue-500/10",
    head: "Mr. N. Anand",
    headQual: "MCA, M.Tech. — 12 years",
    members: [
      { name: "Ms. T. Kumari", qual: "MCA", exp: "5 years" },
      { name: "Mr. S. Raj", qual: "B.Tech. (CS)", exp: "4 years" },
    ],
  },
  {
    name: "Arts & Music",
    icon: Palette,
    color: "from-pink-500/10 to-purple-500/10",
    head: "Mr. D. Das",
    headQual: "MFA (Visual Arts) — 14 years",
    members: [
      { name: "Mrs. L. Tirkey", qual: "M.A. (Music)", exp: "9 years" },
      { name: "Mr. P. Topno", qual: "BFA", exp: "6 years" },
    ],
  },
];

const STATS = [
  { value: "71+", label: "Skilled Teachers", sub: "Including visiting faculty" },
  { value: "15+", label: "Avg. Experience", sub: "Years per department head" },
  { value: "17:1", label: "Student-Teacher Ratio", sub: "Personalized attention" },
  { value: "100%", label: "Trained Faculty", sub: "B.Ed. or equivalent" },
];

export default function FacultyPage() {
  return (
    <PageLayout
      badge="MEET OUR EDUCATORS"
      title={<>Our <span className="text-gradient-xavier">Faculty</span></>}
      subtitle="71+ dedicated teachers across 8 departments — the heart and soul of St. Xavier's. Every child is seen, heard, and challenged to become their best."
    >
      {/* Stats */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} variant="elastic" delay={i * 0.05}>
                <div className="rounded-2xl border border-xavier/10 bg-card p-5 text-center">
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-gradient-xavier">{s.value}</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground mt-1">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-12 sm:py-16 bg-cream-gradient">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal variant="up" className="mb-8">
            <div className="flex items-center gap-3">
              <Users className="size-6 text-gold" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">Department-wise Faculty</h2>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-5">
            {DEPARTMENTS.map((dept, i) => (
              <Reveal key={dept.name} variant="wave" delay={i * 0.04}>
                <div className={`rounded-2xl border border-xavier/10 bg-gradient-to-br ${dept.color} p-5 sm:p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-11 rounded-xl bg-xavier-gradient flex items-center justify-center">
                      <dept.icon className="size-5 text-gold-light" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-xavier-dark">{dept.name} Department</h3>
                      <p className="text-xs text-muted-foreground">{dept.members.length + 1} faculty members</p>
                    </div>
                  </div>

                  {/* Department Head */}
                  <div className="rounded-xl bg-card/80 border border-gold/20 p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="size-3.5 text-gold" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Department Head</span>
                    </div>
                    <p className="font-serif font-bold text-xavier-dark text-sm">{dept.head}</p>
                    <p className="text-xs text-muted-foreground">{dept.headQual}</p>
                  </div>

                  {/* Members */}
                  <div className="space-y-2">
                    {dept.members.map((m) => (
                      <div key={m.name} className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <div>
                          <span className="font-medium text-foreground">{m.name}</span>
                          <span className="text-muted-foreground ml-2">{m.qual}</span>
                        </div>
                        <span className="text-muted-foreground text-xs shrink-0">{m.exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal variant="scale" className="mt-8">
            <div className="rounded-2xl border border-xavier/10 bg-card p-5 text-center">
              <GraduationCap className="size-8 mx-auto mb-2 text-gold" />
              <p className="text-sm text-muted-foreground">
                This is a representative directory. For the complete and current faculty list, please contact the school office.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PageLayout>
  );
}
