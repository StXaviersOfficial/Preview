import "server-only";
import { getDb, isFirebaseAvailable, serverTimestamp } from "@/lib/firebase-admin";
import { SEED_FEES, SEED_FAQS, SEED_NOTICES, SEED_TIMETABLE } from "@/lib/site/seed-data";

/**
 * Firestore data access layer.
 * 
 * This replaces Prisma/SQLite (which doesn't work on Vercel serverless).
 * Uses Firestore as primary data store, with seed data as fallback.
 * 
 * Collections:
 * - fees: FeeRow documents
 * - faqs: Faq documents
 * - notices: Notice documents
 * - timetable: TimetableEntry documents
 * - enquiries: ContactSubmission documents
 * - replies: Reply documents
 * - adminLogs: AdminLog documents
 */

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type FeeRow = {
  id: string;
  label: string;
  amount: number;
  frequency: string;
  category: string;
  note?: string | null;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Notice = {
  id: string;
  text: string;
  link?: string | null;
  active: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TimetableEntry = {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  classGrade: string;
  teacher?: string | null;
  room?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  grade?: string | null;
  message?: string | null;
  createdAt: Date;
  status: string;
  replies?: Reply[];
};

export type Reply = {
  id: string;
  submissionId: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  body: string;
  sentAt: Date;
};

export type AdminLog = {
  id: string;
  action: string;
  detail?: string | null;
  ip?: string | null;
  createdAt: Date;
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Convert Firestore timestamps
// ═══════════════════════════════════════════════════════════════

function convertTimestamps<T extends Record<string, unknown>>(
  data: Record<string, unknown>
): T {
  const result: Record<string, unknown> = { ...data };
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (val && typeof val === "object" && "toDate" in val && typeof (val as { toDate: () => Date }).toDate === "function") {
      result[key] = (val as { toDate: () => Date }).toDate();
    }
  }
  return result as T;
}

// ═══════════════════════════════════════════════════════════════
// FEES
// ═══════════════════════════════════════════════════════════════

export async function getFees(): Promise<FeeRow[]> {
  if (!isFirebaseAvailable()) {
    return SEED_FEES.map((f, i) => ({
      ...f,
      id: `seed-fee-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as FeeRow[];
  }

  try {
    const db = getDb()!;
    const snapshot = await db.collection("fees").orderBy("order").orderBy("createdAt").get();
    
    if (snapshot.empty) {
      // Seed Firestore on first run
      const batch = db.batch();
      SEED_FEES.forEach((fee, i) => {
        const ref = db.collection("fees").doc();
        batch.set(ref, { ...fee, id: ref.id, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      });
      await batch.commit();
      
      return SEED_FEES.map((f, i) => ({
        ...f,
        id: `seed-fee-${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as FeeRow[];
    }

    return snapshot.docs.map(doc => convertTimestamps<FeeRow>({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("[Firestore] getFees error:", err);
    return SEED_FEES.map((f, i) => ({
      ...f,
      id: `seed-fee-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as FeeRow[];
  }
}

export async function createFee(data: Omit<FeeRow, "id" | "createdAt" | "updatedAt">): Promise<FeeRow> {
  const db = getDb()!;
  const ref = db.collection("fees").doc();
  const doc = {
    ...data,
    id: ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await ref.set(doc);
  return { ...data, id: ref.id, createdAt: new Date(), updatedAt: new Date() };
}

export async function updateFee(id: string, data: Partial<FeeRow>): Promise<FeeRow> {
  const db = getDb()!;
  await db.collection("fees").doc(id).update({
    ...data,
    updatedAt: serverTimestamp(),
  });
  const doc = await db.collection("fees").doc(id).get();
  return convertTimestamps<FeeRow>({ id: doc.id, ...doc.data() });
}

export async function deleteFee(id: string): Promise<void> {
  const db = getDb()!;
  await db.collection("fees").doc(id).delete();
}

// ═══════════════════════════════════════════════════════════════
// FAQs
// ═══════════════════════════════════════════════════════════════

export async function getFaqs(): Promise<Faq[]> {
  if (!isFirebaseAvailable()) {
    return SEED_FAQS.map((f, i) => ({
      ...f,
      id: `seed-faq-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as Faq[];
  }

  try {
    const db = getDb()!;
    const snapshot = await db.collection("faqs").where("active", "==", true).orderBy("order").orderBy("createdAt").get();
    
    if (snapshot.empty) {
      // Seed Firestore on first run
      const batch = db.batch();
      SEED_FAQS.forEach((faq) => {
        const ref = db.collection("faqs").doc();
        batch.set(ref, { ...faq, id: ref.id, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      });
      await batch.commit();
      
      return SEED_FAQS.map((f, i) => ({
        ...f,
        id: `seed-faq-${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as Faq[];
    }

    return snapshot.docs.map(doc => convertTimestamps<Faq>({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("[Firestore] getFaqs error:", err);
    return SEED_FAQS.map((f, i) => ({
      ...f,
      id: `seed-faq-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as Faq[];
  }
}

export async function getAllFaqs(): Promise<Faq[]> {
  if (!isFirebaseAvailable()) return getFaqs();
  const db = getDb()!;
  const snapshot = await db.collection("faqs").orderBy("order").orderBy("createdAt").get();
  return snapshot.docs.map(doc => convertTimestamps<Faq>({ id: doc.id, ...doc.data() }));
}

export async function createFaq(data: Omit<Faq, "id" | "createdAt" | "updatedAt">): Promise<Faq> {
  const db = getDb()!;
  const ref = db.collection("faqs").doc();
  const doc = {
    ...data,
    id: ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await ref.set(doc);
  return { ...data, id: ref.id, createdAt: new Date(), updatedAt: new Date() };
}

export async function updateFaq(id: string, data: Partial<Faq>): Promise<Faq> {
  const db = getDb()!;
  await db.collection("faqs").doc(id).update({
    ...data,
    updatedAt: serverTimestamp(),
  });
  const doc = await db.collection("faqs").doc(id).get();
  return convertTimestamps<Faq>({ id: doc.id, ...doc.data() });
}

export async function deleteFaq(id: string): Promise<void> {
  const db = getDb()!;
  await db.collection("faqs").doc(id).delete();
}

// ═══════════════════════════════════════════════════════════════
// NOTICES
// ═══════════════════════════════════════════════════════════════

export async function getNotices(): Promise<Notice[]> {
  if (!isFirebaseAvailable()) {
    return SEED_NOTICES.map((n, i) => ({
      ...n,
      id: `seed-notice-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as Notice[];
  }

  try {
    const db = getDb()!;
    const snapshot = await db.collection("notices").where("active", "==", true).orderBy("order").orderBy("createdAt", "desc").get();
    
    if (snapshot.empty) {
      // Seed Firestore
      const batch = db.batch();
      SEED_NOTICES.forEach((notice) => {
        const ref = db.collection("notices").doc();
        batch.set(ref, { ...notice, id: ref.id, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      });
      await batch.commit();
      
      return SEED_NOTICES.map((n, i) => ({
        ...n,
        id: `seed-notice-${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as Notice[];
    }

    return snapshot.docs.map(doc => convertTimestamps<Notice>({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("[Firestore] getNotices error:", err);
    return SEED_NOTICES.map((n, i) => ({
      ...n,
      id: `seed-notice-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as Notice[];
  }
}

export async function getAllNotices(): Promise<Notice[]> {
  if (!isFirebaseAvailable()) return getNotices();
  const db = getDb()!;
  const snapshot = await db.collection("notices").orderBy("order").orderBy("createdAt", "desc").get();
  return snapshot.docs.map(doc => convertTimestamps<Notice>({ id: doc.id, ...doc.data() }));
}

export async function createNotice(data: Omit<Notice, "id" | "createdAt" | "updatedAt">): Promise<Notice> {
  const db = getDb()!;
  const ref = db.collection("notices").doc();
  await ref.set({
    ...data,
    id: ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { ...data, id: ref.id, createdAt: new Date(), updatedAt: new Date() };
}

export async function updateNotice(id: string, data: Partial<Notice>): Promise<Notice> {
  const db = getDb()!;
  await db.collection("notices").doc(id).update({
    ...data,
    updatedAt: serverTimestamp(),
  });
  const doc = await db.collection("notices").doc(id).get();
  return convertTimestamps<Notice>({ id: doc.id, ...doc.data() });
}

export async function deleteNotice(id: string): Promise<void> {
  const db = getDb()!;
  await db.collection("notices").doc(id).delete();
}

// ═══════════════════════════════════════════════════════════════
// TIMETABLE
// ═══════════════════════════════════════════════════════════════

export async function getTimetable(): Promise<TimetableEntry[]> {
  if (!isFirebaseAvailable()) {
    return SEED_TIMETABLE.map((t, i) => ({
      ...t,
      id: `seed-tt-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as TimetableEntry[];
  }

  try {
    const db = getDb()!;
    const snapshot = await db.collection("timetable").orderBy("day").orderBy("period").get();
    
    if (snapshot.empty) {
      // Seed Firestore
      const batch = db.batch();
      SEED_TIMETABLE.forEach((entry) => {
        const ref = db.collection("timetable").doc();
        batch.set(ref, { ...entry, id: ref.id, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      });
      await batch.commit();
      
      return SEED_TIMETABLE.map((t, i) => ({
        ...t,
        id: `seed-tt-${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as TimetableEntry[];
    }

    return snapshot.docs.map(doc => convertTimestamps<TimetableEntry>({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("[Firestore] getTimetable error:", err);
    return SEED_TIMETABLE.map((t, i) => ({
      ...t,
      id: `seed-tt-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as TimetableEntry[];
  }
}

export async function createTimetableEntry(data: Omit<TimetableEntry, "id" | "createdAt" | "updatedAt">): Promise<TimetableEntry> {
  const db = getDb()!;
  const ref = db.collection("timetable").doc();
  await ref.set({
    ...data,
    id: ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { ...data, id: ref.id, createdAt: new Date(), updatedAt: new Date() };
}

export async function updateTimetableEntry(id: string, data: Partial<TimetableEntry>): Promise<TimetableEntry> {
  const db = getDb()!;
  await db.collection("timetable").doc(id).update({
    ...data,
    updatedAt: serverTimestamp(),
  });
  const doc = await db.collection("timetable").doc(id).get();
  return convertTimestamps<TimetableEntry>({ id: doc.id, ...doc.data() });
}

export async function deleteTimetableEntry(id: string): Promise<void> {
  const db = getDb()!;
  await db.collection("timetable").doc(id).delete();
}

// ═══════════════════════════════════════════════════════════════
// CONTACT SUBMISSIONS (ENQUIRIES)
// ═══════════════════════════════════════════════════════════════

export async function createEnquiry(data: {
  name: string;
  email: string;
  phone?: string;
  grade?: string;
  message?: string;
}): Promise<ContactSubmission> {
  const db = getDb()!;
  const ref = db.collection("enquiries").doc();
  const doc = {
    ...data,
    id: ref.id,
    status: "new",
    createdAt: serverTimestamp(),
  };
  await ref.set(doc);
  return { ...data, id: ref.id, status: "new", createdAt: new Date() };
}

export async function getEnquiries(limit = 50): Promise<ContactSubmission[]> {
  if (!isFirebaseAvailable()) return [];
  const db = getDb()!;
  const snapshot = await db.collection("enquiries").orderBy("createdAt", "desc").limit(limit).get();
  return snapshot.docs.map(doc => convertTimestamps<ContactSubmission>({ id: doc.id, ...doc.data() }));
}

export async function getEnquiry(id: string): Promise<ContactSubmission | null> {
  if (!isFirebaseAvailable()) return null;
  const db = getDb()!;
  const doc = await db.collection("enquiries").doc(id).get();
  if (!doc.exists) return null;
  return convertTimestamps<ContactSubmission>({ id: doc.id, ...doc.data() });
}

export async function updateEnquiryStatus(id: string, status: string): Promise<void> {
  if (!isFirebaseAvailable()) return;
  const db = getDb()!;
  await db.collection("enquiries").doc(id).update({ status });
}

// ═══════════════════════════════════════════════════════════════
// REPLIES
// ═══════════════════════════════════════════════════════════════

export async function createReply(data: {
  submissionId: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  body: string;
}): Promise<Reply> {
  const db = getDb()!;
  const ref = db.collection("replies").doc();
  await ref.set({
    ...data,
    id: ref.id,
    sentAt: serverTimestamp(),
  });
  return { ...data, id: ref.id, sentAt: new Date() };
}

export async function getReplies(submissionId: string): Promise<Reply[]> {
  if (!isFirebaseAvailable()) return [];
  const db = getDb()!;
  const snapshot = await db.collection("replies").where("submissionId", "==", submissionId).orderBy("sentAt", "desc").get();
  return snapshot.docs.map(doc => convertTimestamps<Reply>({ id: doc.id, ...doc.data() }));
}

// ═══════════════════════════════════════════════════════════════
// ADMIN LOGS
// ═══════════════════════════════════════════════════════════════

export async function logAdminAction(action: string, detail?: string, ip?: string): Promise<void> {
  if (!isFirebaseAvailable()) return;
  try {
    const db = getDb()!;
    await db.collection("adminLogs").add({
      action,
      detail: detail || null,
      ip: ip || null,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("[Firestore] logAdminAction error:", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// STATS (for admin dashboard)
// ═══════════════════════════════════════════════════════════════

export async function getStats(): Promise<{
  newEnquiries: number;
  totalEnquiries: number;
  activeFees: number;
  activeNotices: number;
  activeFaqs: number;
  timetableEntries: number;
}> {
  if (!isFirebaseAvailable()) {
    return {
      newEnquiries: 0,
      totalEnquiries: 0,
      activeFees: SEED_FEES.length,
      activeNotices: SEED_NOTICES.length,
      activeFaqs: SEED_FAQS.length,
      timetableEntries: SEED_TIMETABLE.length,
    };
  }

  try {
    const db = getDb()!;
    const [enquiriesSnap, feesSnap, noticesSnap, faqsSnap, timetableSnap] = await Promise.all([
      db.collection("enquiries").get(),
      db.collection("fees").get(),
      db.collection("notices").where("active", "==", true).get(),
      db.collection("faqs").where("active", "==", true).get(),
      db.collection("timetable").get(),
    ]);

    let newEnquiries = 0;
    enquiriesSnap.forEach(doc => {
      if (doc.get("status") === "new") newEnquiries++;
    });

    return {
      newEnquiries,
      totalEnquiries: enquiriesSnap.size,
      activeFees: feesSnap.size,
      activeNotices: noticesSnap.size,
      activeFaqs: faqsSnap.size,
      timetableEntries: timetableSnap.size,
    };
  } catch (err) {
    console.error("[Firestore] getStats error:", err);
    return {
      newEnquiries: 0,
      totalEnquiries: 0,
      activeFees: SEED_FEES.length,
      activeNotices: SEED_NOTICES.length,
      activeFaqs: SEED_FAQS.length,
      timetableEntries: SEED_TIMETABLE.length,
    };
  }
}
