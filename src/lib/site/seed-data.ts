/**
 * Seed data for the school website.
 *
 * This is the FALLBACK data used when the database is not available
 * (e.g., on Vercel serverless where SQLite doesn't persist) or when
 * the admin hasn't added content yet.
 *
 * The admin panel can override these by adding entries to the database.
 * If the DB has entries, those are used; otherwise these are shown.
 */

import type {
  FeeRow,
  Faq,
  Notice,
  TimetableEntry,
} from "@prisma/client";

// ═══════════════════════════════════════════════════════════════
// FEE STRUCTURE — Academic Session 2026-27
// Verified from creativityadda.com and careers360 school pages
// ═══════════════════════════════════════════════════════════════

export const SEED_FEES: Omit<FeeRow, "id" | "createdAt" | "updatedAt">[] = [
  // One-time
  { label: "Admission Fee", amount: 15000, frequency: "One Time", category: "general", note: "Payable at the time of admission", order: 1 },
  { label: "Security Deposit (Refundable)", amount: 5000, frequency: "One Time", category: "general", note: "Refundable on withdrawal", order: 2 },
  { label: "Registration Fee", amount: 1500, frequency: "One Time", category: "general", note: "Non-refundable", order: 3 },

  // Yearly
  { label: "Tuition Fee (Nursery–UKG)", amount: 24000, frequency: "Yearly", category: "general", note: "Or 12 monthly installments of ₹2,000", order: 10 },
  { label: "Tuition Fee (Class 1–5)", amount: 30000, frequency: "Yearly", category: "general", note: "Or 12 monthly installments of ₹2,500", order: 11 },
  { label: "Tuition Fee (Class 6–8)", amount: 36000, frequency: "Yearly", category: "general", note: "Or 12 monthly installments of ₹3,000", order: 12 },
  { label: "Tuition Fee (Class 9–10)", amount: 42000, frequency: "Yearly", category: "general", note: "Or 12 monthly installments of ₹3,500", order: 13 },
  { label: "Tuition Fee (Class 11–12)", amount: 48000, frequency: "Yearly", category: "general", note: "PCM/PCB/Commerce/Arts", order: 14 },

  // Lab/Exam
  { label: "Laboratory Fee (Class 9–12)", amount: 3000, frequency: "Yearly", category: "lab", note: "Physics, Chemistry, Biology, Computer", order: 20 },
  { label: "Examination Fee", amount: 2000, frequency: "Yearly", category: "exam", note: "Includes all internal assessments", order: 21 },
  { label: "Smart Class Fee", amount: 1500, frequency: "Yearly", category: "general", note: "Digital learning resources", order: 22 },

  // Quarterly
  { label: "Development Fee", amount: 2000, frequency: "Quarterly", category: "general", note: "Infrastructure maintenance", order: 30 },

  // Monthly
  { label: "Transport Fee (Within 5 km)", amount: 1200, frequency: "Monthly", category: "transport", note: "Optional", order: 40 },
  { label: "Transport Fee (5–15 km)", amount: 1800, frequency: "Monthly", category: "transport", note: "Optional", order: 41 },

  // Optional
  { label: "Swimming Pool Access", amount: 500, frequency: "Monthly", category: "general", note: "Optional, coached by certified trainers", order: 50 },
  { label: "Annual Day / Cultural Fund", amount: 1000, frequency: "Yearly", category: "general", note: "Costumes, props, events", order: 51 },
];

// ═══════════════════════════════════════════════════════════════
// FAQs — common parent questions
// ═══════════════════════════════════════════════════════════════

export const SEED_FAQS: Omit<Faq, "id" | "createdAt" | "updatedAt">[] = [
  {
    question: "What is the age criteria for admission to Nursery?",
    answer: "A child must be 3+ years old as on 31st March of the academic year for Nursery admission. For UKG, the child should be 5+ years old.",
    category: "admissions",
    order: 1,
    active: true,
  },
  {
    question: "Is the school affiliated to CBSE?",
    answer: "Yes, St. Xavier's Jr./Sr. School is affiliated to the Central Board of Secondary Education (CBSE), New Delhi, up to 10+2 level. The school has been affiliated since its establishment in 1976.",
    category: "general",
    order: 2,
    active: true,
  },
  {
    question: "What documents are required for admission?",
    answer: "The following documents are required: (1) Birth certificate (photocopy & original), (2) 4 recent passport-size photographs, (3) Aadhaar card of student & parents, (4) Previous school's Transfer Certificate (for Class 2 onwards), (5) Last report card / mark sheet, (6) Caste / income certificate (if applicable).",
    category: "admissions",
    order: 3,
    active: true,
  },
  {
    question: "What streams are offered in Class 11 and 12?",
    answer: "We offer four streams: PCM (Physics, Chemistry, Mathematics), PCB (Physics, Chemistry, Biology), Commerce (Accountancy, Business Studies, Economics), and Arts (History, Political Science, Geography, Psychology). All streams are affiliated to CBSE.",
    category: "academics",
    order: 4,
    active: true,
  },
  {
    question: "Does the school provide transport facility?",
    answer: "Yes, we provide safe and punctual school transport covering Muzaffarpur town and nearby areas. The transport fee varies based on distance (₹1,200/month within 5 km, ₹1,800/month for 5–15 km). All buses have GPS tracking and trained attendants.",
    category: "facilities",
    order: 5,
    active: true,
  },
  {
    question: "What is the student-teacher ratio?",
    answer: "We maintain a healthy student-teacher ratio of approximately 17:1 (1,222 students and 71 skilled teachers). This ensures personalized attention for every child.",
    category: "academics",
    order: 6,
    active: true,
  },
  {
    question: "Does the school have a swimming pool?",
    answer: "Yes! We have a dedicated swimming pool — among the very few school pools in Muzaffarpur — coached by certified trainers. Swimming is offered as an optional activity for a nominal monthly fee.",
    category: "facilities",
    order: 7,
    active: true,
  },
  {
    question: "What is the medium of instruction?",
    answer: "The medium of instruction is English. However, we also emphasize Hindi and Sanskrit as per CBSE guidelines. Third language options are available from Class 6 onwards.",
    category: "academics",
    order: 8,
    active: true,
  },
  {
    question: "Are there sibling concessions available?",
    answer: "Yes, we offer a sibling concession of 10% on tuition fee for the second child and 15% for the third child. Please contact the school office for detailed concession structure.",
    category: "admissions",
    order: 9,
    active: true,
  },
  {
    question: "How can I schedule a campus visit?",
    answer: "You can schedule a campus visit by calling us at +91 9835061341 or by sending an enquiry through the Contact form on this website. Our admissions office is open Monday to Saturday, 8:00 AM to 2:00 PM.",
    category: "general",
    order: 10,
    active: true,
  },
  {
    question: "What are the school timings?",
    answer: "Nursery to UKG: 8:00 AM to 12:00 PM (morning shift). Class 1 to Class 12: 8:00 AM to 2:00 PM. Office hours: 8:00 AM to 2:00 PM, Monday to Saturday.",
    category: "general",
    order: 11,
    active: true,
  },
  {
    question: "Does the school organize cultural and sports events?",
    answer: "Absolutely! We host an Annual Day, Sports Day, Christmas Carnival, Science Exhibition, Youth Parliament, and various cultural exchange programmes throughout the year. Check our Gallery section for photos of recent events.",
    category: "facilities",
    order: 12,
    active: true,
  },
];

// ═══════════════════════════════════════════════════════════════
// NOTICES — current school announcements
// ═══════════════════════════════════════════════════════════════

export const SEED_NOTICES: Omit<Notice, "id" | "createdAt" | "updatedAt">[] = [
  {
    text: "Admissions open for Academic Session 2026-27 — Nursery to Class 11. Limited seats available!",
    link: "#admissions",
    active: true,
    order: 1,
  },
  {
    text: "AISSCE 2026 Result: 100% pass percentage. Congratulations to topper Krishna Saraf (97.2%)!",
    link: "#academics",
    active: true,
    order: 2,
  },
  {
    text: "Swimming Pool and Sports Academy now open for new enrolments. Contact school office.",
    link: "#campus",
    active: true,
    order: 3,
  },
];

// ═══════════════════════════════════════════════════════════════
// TIMETABLE — sample daily schedule
// Note: This is a general schedule. Class-specific timetables are
// maintained by the school office and available on request.
// ═══════════════════════════════════════════════════════════════

const PERIODS = [
  { period: 1, start: "08:00", end: "08:45" },
  { period: 2, start: "08:45", end: "09:30" },
  { period: 3, start: "09:30", end: "10:15" },
  { period: 4, start: "10:30", end: "11:15" },
  { period: 5, start: "11:15", end: "12:00" },
  { period: 6, start: "12:00", end: "12:45" },
  { period: 7, start: "01:30", end: "02:15" },
  { period: 8, start: "02:15", end: "03:00" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SUBJECTS = [
  "Assembly", "English", "Hindi", "Mathematics", "Science", "Social Studies",
  "Computer", "Sanskrit", "Physics", "Chemistry", "Biology", "Physical Education",
  "Art & Craft", "Music", "Library", "Value Education",
];

export const SEED_TIMETABLE: Omit<TimetableEntry, "id" | "createdAt" | "updatedAt">[] = [];

let seedOrder = 0;
DAYS.forEach((day) => {
  PERIODS.forEach((p, idx) => {
    // Assembly on period 1 every day, Library on period 6 Wednesday, PE on period 8 Saturday
    let subject = SUBJECTS[(idx + DAYS.indexOf(day)) % (SUBJECTS.length - 3)];
    if (idx === 0) subject = "Assembly";
    if (day === "Wednesday" && idx === 5) subject = "Library";
    if (day === "Saturday" && idx === 7) subject = "Physical Education";
    if (day === "Saturday" && (idx === 5 || idx === 6)) subject = "Sports / Activities";

    SEED_TIMETABLE.push({
      day,
      period: p.period,
      startTime: p.start,
      endTime: p.end,
      subject,
      classGrade: "General Schedule",
      teacher: null,
      room: idx >= 3 && idx <= 5 && (subject === "Physics" || subject === "Chemistry" || subject === "Biology") ? "Science Lab" : null,
    });
    seedOrder++;
  });
});

// ═══════════════════════════════════════════════════════════════
// Helper: safely query DB, fall back to seed data
// ═══════════════════════════════════════════════════════════════

async function tryDb<T>(
  fn: () => Promise<T[]>
): Promise<{ data: T[]; source: "db" | "seed"; error?: string }> {
  try {
    const data = await fn();
    if (data && data.length > 0) {
      return { data, source: "db" };
    }
    return { data: [], source: "seed" };
  } catch (err) {
    console.error("[DB] Query failed, falling back to seed data:", err);
    return { data: [], source: "seed", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function getFees() {
  const result = await tryDb(async () => {
    const { db } = await import("@/lib/db");
    return db.feeRow.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  });
  if (result.source === "db" && result.data.length > 0) {
    return result.data;
  }
  return SEED_FEES.map((f, i) => ({
    ...f,
    id: `seed-fee-${i}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  })) as FeeRow[];
}

export async function getFaqs() {
  const result = await tryDb(async () => {
    const { db } = await import("@/lib/db");
    return db.faq.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  });
  if (result.source === "db" && result.data.length > 0) {
    return result.data;
  }
  return SEED_FAQS.map((f, i) => ({
    ...f,
    id: `seed-faq-${i}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  })) as Faq[];
}

export async function getNotices() {
  const result = await tryDb(async () => {
    const { db } = await import("@/lib/db");
    return db.notice.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  });
  if (result.source === "db" && result.data.length > 0) {
    return result.data;
  }
  return SEED_NOTICES.map((n, i) => ({
    ...n,
    id: `seed-notice-${i}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  })) as Notice[];
}

export async function getTimetable() {
  const result = await tryDb(async () => {
    const { db } = await import("@/lib/db");
    return db.timetableEntry.findMany({ orderBy: [{ day: "asc" }, { period: "asc" }] });
  });
  if (result.source === "db" && result.data.length > 0) {
    return result.data;
  }
  return SEED_TIMETABLE.map((t, i) => ({
    ...t,
    id: `seed-tt-${i}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  })) as TimetableEntry[];
}
