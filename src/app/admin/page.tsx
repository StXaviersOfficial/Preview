'use client'

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Mail, Clock, Receipt, LogOut, Lock, Send,
  Trash2, Plus, Edit2, X, Check, AlertCircle, Search, Phone,
  Mail as MailIcon, Calendar, RefreshCw, ChevronDown, User, Reply,
  Megaphone, HelpCircle, ArrowLeft, Home,
} from "lucide-react";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  grade?: string | null;
  message?: string | null;
  createdAt: string;
  status: string;
  replies: Reply[];
};

type Reply = {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  fromEmail: string;
};

type TimetableEntry = {
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

type FeeRow = {
  id: string;
  label: string;
  amount: number;
  frequency: string;
  category: string;
  note?: string | null;
  order: number;
};

type Notice = {
  id: string;
  text: string;
  link: string | null;
  active: boolean;
  order: number;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
};

type Tab = "dashboard" | "enquiries" | "timetable" | "fees" | "notices" | "faqs";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const FREQUENCIES = ["One Time", "Yearly", "Quarterly", "Monthly"];
const CATEGORIES = ["general", "lab", "hostel", "transport", "exam"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [bootChecked, setBootChecked] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");

  // Boot check
  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((d) => {
        setAuthed(d.admin === true);
        setBootChecked(true);
      })
      .catch(() => setBootChecked(true));
  }, []);

  if (!bootChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-xavier-dark text-cream">
        <RefreshCw className="size-6 animate-spin text-gold-light" />
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-cream-gradient text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-xavier-dark text-cream shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: logo + back button */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 hover:bg-cream/20 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors shrink-0"
              title="Back to website"
            >
              <ArrowLeft className="size-3.5 sm:size-4" />
              <span className="hidden sm:inline">Back to Website</span>
            </a>
            <div className="size-9 rounded-full bg-gold-gradient flex items-center justify-center overflow-hidden shrink-0">
              <img src="/school/logo-white.png" alt="Logo" className="h-full w-full object-contain scale-110" />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-sm sm:text-base leading-tight truncate">St. Xavier&apos;s Admin</p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/60 truncate">Muzaffarpur • Internal</p>
            </div>
          </div>
          {/* Right: home + logout */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cream/10 hover:bg-cream/20 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors sm:hidden"
              title="Back to website"
              aria-label="Back to website"
            >
              <Home className="size-3.5 sm:size-4" />
            </a>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                setAuthed(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 hover:bg-cream/15 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors"
            >
              <LogOut className="size-3.5 sm:size-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {([
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "enquiries", label: "Enquiries", icon: Mail },
            { id: "timetable", label: "Timetable", icon: Clock },
            { id: "fees", label: "Fees", icon: Receipt },
            { id: "notices", label: "Notices", icon: Megaphone },
            { id: "faqs", label: "FAQs", icon: HelpCircle },
          ] as { id: Tab; label: string; icon: React.ElementType }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-xavier-gradient text-cream shadow-glow-xavier"
                  : "bg-card border border-xavier/10 text-foreground/70 hover:text-xavier-dark"
              }`}
            >
              <t.icon className="size-3.5 sm:size-4" />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
            {tab === "enquiries" && <EnquiriesManager />}
            {tab === "timetable" && <TimetableManager />}
            {tab === "fees" && <FeesManager />}
            {tab === "notices" && <NoticesManager />}
            {tab === "faqs" && <FaqsManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =================== LOGIN =================== */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Login failed.");
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-xavier-dark flex items-center justify-center px-5 py-12 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 size-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-xavier-light/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl glass-dark p-6 sm:p-10 text-cream">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-16 sm:size-20 rounded-full bg-gold-gradient flex items-center justify-center mb-4 shadow-glow-gold">
              <Lock className="size-8 sm:size-10 text-xavier-dark" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">Admin Access</h1>
            <p className="text-xs sm:text-sm text-cream/60 mt-1.5">St. Xavier&apos;s Jr./Sr. School • Muzaffarpur</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-[10px] sm:text-xs uppercase tracking-widest text-cream/60 font-semibold mb-1.5">
                Admin Code
              </label>
              <input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
                placeholder="Enter the admin code"
                className="w-full rounded-xl bg-cream/10 border border-cream/15 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all"
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-500/15 border border-red-400/30 px-4 py-2.5 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gold-gradient px-5 py-3.5 text-sm font-bold text-xavier-dark shadow-glow-gold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="size-4 animate-spin" /> Verifying…
                </span>
              ) : (
                "Enter Admin Panel"
              )}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-[10px] sm:text-xs text-cream/40">
          Authorized personnel only. All access is logged.
        </p>
        <a
          href="/"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-cream/60 hover:text-gold-light transition-colors"
        >
          <ArrowLeft className="size-3" /> Back to website
        </a>
      </motion.div>
    </div>
  );
}

/* =================== DASHBOARD =================== */
function Dashboard({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const [stats, setStats] = useState({ enquiries: 0, newEnquiries: 0, replied: 0, timetable: 0, fees: 0, notices: 0, faqs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/enquiries").then((r) => r.json()),
      fetch("/api/admin/timetable").then((r) => r.json()),
      fetch("/api/admin/fees").then((r) => r.json()),
      fetch("/api/admin/notices").then((r) => r.json()),
      fetch("/api/admin/faqs").then((r) => r.json()),
    ]).then(([enq, tt, fees, notices, faqs]) => {
      if (enq.ok) {
        const submissions = enq.submissions || [];
        setStats((s) => ({
          ...s,
          enquiries: submissions.length,
          newEnquiries: submissions.filter((x: Submission) => x.status === "new").length,
          replied: submissions.filter((x: Submission) => x.status === "replied").length,
        }));
      }
      if (tt.ok) setStats((s) => ({ ...s, timetable: (tt.entries || []).length }));
      if (fees.ok) setStats((s) => ({ ...s, fees: (fees.rows || []).length }));
      if (notices.ok) setStats((s) => ({ ...s, notices: (notices.notices || []).length }));
      if (faqs.ok) setStats((s) => ({ ...s, faqs: (faqs.faqs || []).length }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Enquiries", value: stats.enquiries, sub: `${stats.newEnquiries} new • ${stats.replied} replied`, icon: Mail, color: "from-xavier to-xavier-dark", tab: "enquiries" as Tab },
    { label: "New Enquiries", value: stats.newEnquiries, sub: "Awaiting response", icon: AlertCircle, color: "from-gold to-xavier", tab: "enquiries" as Tab },
    { label: "Timetable Entries", value: stats.timetable, sub: "Across all classes", icon: Clock, color: "from-xavier-light to-xavier", tab: "timetable" as Tab },
    { label: "Fee Rows", value: stats.fees, sub: "Active fee structure", icon: Receipt, color: "from-gold to-xavier-dark", tab: "fees" as Tab },
    { label: "Notices", value: stats.notices, sub: "Public ticker messages", icon: Megaphone, color: "from-xavier to-gold", tab: "notices" as Tab },
    { label: "FAQs", value: stats.faqs, sub: "Public Q&A entries", icon: HelpCircle, color: "from-gold to-xavier-light", tab: "faqs" as Tab },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
        <RefreshCw className="size-4 animate-spin" /> Loading dashboard…
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-1">Welcome back, Admin</h2>
      <p className="text-sm text-muted-foreground mb-5">Here&apos;s what&apos;s happening at St. Xavier&apos;s today.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <motion.button
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            onClick={() => onNavigate(c.tab)}
            className="text-left rounded-2xl border border-xavier/10 bg-card p-4 sm:p-5 hover:shadow-elegant transition-all hover:-translate-y-0.5"
          >
            <div className={`size-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
              <c.icon className="size-5 text-gold-light" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-xavier-dark tabular-nums">{c.value}</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground mt-1">{c.label}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{c.sub}</p>
          </motion.button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-6 sm:mt-8">
        <h3 className="font-serif text-base sm:text-lg font-bold text-xavier-dark mb-3">Quick actions</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <button onClick={() => onNavigate("enquiries")} className="rounded-xl border border-xavier/10 bg-card p-4 hover:border-gold/40 transition-colors text-left">
            <Mail className="size-5 text-gold mb-2" />
            <p className="font-semibold text-sm">View enquiries</p>
            <p className="text-xs text-muted-foreground mt-0.5">Read and reply to new submissions</p>
          </button>
          <button onClick={() => onNavigate("timetable")} className="rounded-xl border border-xavier/10 bg-card p-4 hover:border-gold/40 transition-colors text-left">
            <Clock className="size-5 text-gold mb-2" />
            <p className="font-semibold text-sm">Edit timetable</p>
            <p className="text-xs text-muted-foreground mt-0.5">Add or modify class periods</p>
          </button>
          <button onClick={() => onNavigate("fees")} className="rounded-xl border border-xavier/10 bg-card p-4 hover:border-gold/40 transition-colors text-left">
            <Receipt className="size-5 text-gold mb-2" />
            <p className="font-semibold text-sm">Update fees</p>
            <p className="text-xs text-muted-foreground mt-0.5">Manage fee structure rows</p>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== ENQUIRIES MANAGER =================== */
function EnquiriesManager() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/enquiries");
        const data = await res.json();
        if (!cancelled && data.ok) setSubmissions(data.submissions);
      } catch (e) { console.error("Admin error:", e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const load = () => setReloadKey((k) => k + 1);

  const filtered = submissions
    .filter((s) => filter === "all" ? true : s.status === filter)
    .filter((s) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.message || "").toLowerCase().includes(q);
    });

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setSubmissions((list) => list.map((s) => s.id === id ? { ...s, status } : s));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    await fetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
    setSubmissions((list) => list.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const onReplied = (id: string, reply: Reply) => {
    setSubmissions((list) => list.map((s) => s.id === id ? { ...s, status: "replied", replies: [...s.replies, reply] } : s));
    if (selected?.id === id) setSelected({ ...selected, status: "replied", replies: [...selected.replies, reply] });
  };

  return (
    <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
      {/* List */}
      <div className="lg:col-span-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-xavier-dark">Enquiries</h2>
          <button onClick={load} className="size-8 rounded-full bg-card border border-xavier/10 flex items-center justify-center text-xavier-dark hover:bg-xavier/5" aria-label="Refresh">
            <RefreshCw className="size-4" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name, email, message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-xavier/15 bg-cream/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-xavier/30 mb-3"
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {["all", "new", "read", "replied", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize ${
                filter === s ? "bg-xavier-gradient text-cream" : "bg-card border border-xavier/10 text-foreground/70 hover:text-xavier-dark"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="rounded-xl border border-xavier/10 bg-card p-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <RefreshCw className="size-4 animate-spin" /> Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-xavier/10 bg-card p-6 text-center text-sm text-muted-foreground">
              No enquiries found.
            </div>
          ) : (
            filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelected(s);
                  if (s.status === "new") updateStatus(s.id, "read");
                }}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  selected?.id === s.id
                    ? "border-gold bg-gold/5 shadow-elegant"
                    : "border-xavier/10 bg-card hover:border-xavier/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-xavier-dark truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    {s.grade && <p className="text-[10px] text-gold mt-1">{s.grade}</p>}
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                {s.message && <p className="text-xs text-foreground/70 mt-2 line-clamp-2">{s.message}</p>}
                <p className="text-[10px] text-muted-foreground mt-2">{new Date(s.createdAt).toLocaleString('en-IN')}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-xavier/10 bg-card p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-xavier-dark">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <InfoChip icon={Phone} label="Phone" value={selected.phone || "—"} />
                <InfoChip icon={Calendar} label="Class" value={selected.grade || "—"} />
                <InfoChip icon={Clock} label="Received" value={new Date(selected.createdAt).toLocaleString('en-IN')} />
                <InfoChip icon={MailIcon} label="Email" value={selected.email} />
              </div>

              <div className="rounded-xl bg-cream/50 p-4 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Message</p>
                <p className="text-sm text-foreground/85 whitespace-pre-wrap">{selected.message || "(no message)"}</p>
              </div>

              {/* Previous replies */}
              {selected.replies.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Previous replies ({selected.replies.length})</p>
                  <div className="space-y-2">
                    {selected.replies.map((r) => (
                      <div key={r.id} className="rounded-xl border border-gold/30 bg-gold/5 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-xavier-dark">{r.subject}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(r.sentAt).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-xs text-foreground/80 whitespace-pre-wrap">{r.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ReplyBox key={selected.id} submission={selected} onReplied={onReplied} />

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-xavier/10 flex flex-wrap items-center gap-2">
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  className="rounded-lg border border-xavier/15 bg-cream/40 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-xavier/30"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  onClick={() => deleteEnquiry(selected.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 text-red-600 px-3 py-2 text-xs font-medium hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
              <Mail className="size-12 mx-auto mb-3 text-gold/40" />
              <p className="text-sm">Select an enquiry from the left to view details and reply.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-red-500/15 text-red-600 border-red-500/30",
    read: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    replied: "bg-green-500/15 text-green-700 border-green-500/30",
    archived: "bg-gray-500/15 text-gray-600 border-gray-500/30",
  };
  return (
    <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-semibold ${colors[status] || colors.read}`}>
      {status}
    </span>
  );
}

function InfoChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-cream/50 p-3 flex items-start gap-2.5">
      <Icon className="size-4 text-gold mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground/85 break-words">{value}</p>
      </div>
    </div>
  );
}

function ReplyBox({ submission, onReplied }: { submission: Submission; onReplied: (id: string, reply: Reply) => void }) {
  const [subject, setSubject] = useState(`Re: Your enquiry to St. Xavier's Jr./Sr. School`);
  const [body, setBody] = useState(`Dear ${submission.name},\n\nThank you for reaching out to St. Xavier's Jr./Sr. School.\n\n`);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const send = async () => {
    if (sending) return;
    setSending(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id, subject, body }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send reply.");
      onReplied(submission.id, data.reply);
      setSuccess(data.emailSent ? "Reply sent! Email delivered to enquirer." : "Reply saved, but email could not be sent (SMTP not configured).");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-xl border border-xavier/15 bg-cream/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Reply className="size-4 text-gold" />
        <p className="text-sm font-semibold text-xavier-dark">Reply to {submission.name}</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xavier/30"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Message</label>
          <textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xavier/30 resize-y"
          />
        </div>
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="size-3.5" /> {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2 text-xs text-green-700 flex items-center gap-2">
            <Check className="size-3.5" /> {success}
          </div>
        )}
        <button
          onClick={send}
          disabled={sending || !subject.trim() || !body.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-xavier-gradient px-5 py-2.5 text-sm font-semibold text-cream shadow-glow-xavier disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? (
            <><RefreshCw className="size-4 animate-spin" /> Sending…</>
          ) : (
            <><Send className="size-4" /> Send Reply</>
          )}
        </button>
      </div>
    </div>
  );
}

/* =================== TIMETABLE MANAGER =================== */
function TimetableManager() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TimetableEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/timetable");
        const data = await res.json();
        if (!cancelled && data.ok) setEntries(data.entries);
      } catch (e) { console.error("Admin error:", e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const load = () => setReloadKey((k) => k + 1);

  const grouped = DAYS.map((day) => ({
    day,
    periods: entries.filter((e) => e.day === day).sort((a, b) => a.period - b.period),
  }));

  const classGrades = Array.from(new Set(entries.map((e) => e.classGrade)));

  const onDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/admin/timetable?id=${id}`, { method: "DELETE" });
    setEntries((list) => list.filter((e) => e.id !== id));
  };

  const onSave = async (entry: Partial<TimetableEntry>) => {
    if (entry.id) {
      const res = await fetch("/api/admin/timetable", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (data.ok) {
        setEntries((list) => list.map((e) => e.id === entry.id ? data.entry : e));
      }
    } else {
      const res = await fetch("/api/admin/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (data.ok) setEntries((list) => [...list, data.entry]);
    }
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-xavier-dark">Timetable</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{entries.length} entries • {classGrades.length} classes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="size-9 rounded-full bg-card border border-xavier/10 flex items-center justify-center text-xavier-dark hover:bg-xavier/5" aria-label="Refresh">
            <RefreshCw className="size-4" />
          </button>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-xs sm:text-sm font-semibold text-cream shadow-glow-xavier"
          >
            <Plus className="size-4" /> Add Entry
          </button>
        </div>
      </div>

      {showForm && (
        <TimetableForm
          initial={editing}
          onSave={onSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {loading ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="size-4 animate-spin" /> Loading…
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
          <Clock className="size-10 mx-auto mb-3 text-gold/40" />
          No timetable entries yet. Click &ldquo;Add Entry&rdquo; to create the first one.
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {grouped.map(({ day, periods }) => (
            <div key={day} className="rounded-2xl border border-xavier/10 bg-card overflow-hidden">
              <div className="bg-xavier-gradient px-4 py-2.5 text-cream flex items-center justify-between">
                <span className="font-serif font-bold text-sm">{day}</span>
                <span className="text-[10px] uppercase tracking-widest text-cream/60">{periods.length} periods</span>
              </div>
              <div className="divide-y divide-xavier/5">
                {periods.length === 0 ? (
                  <p className="px-4 py-4 text-xs text-muted-foreground text-center">No entries</p>
                ) : periods.map((p) => (
                  <div key={p.id} className="px-3 py-2.5 flex items-center gap-2 group">
                    <div className="shrink-0 size-8 rounded-lg bg-gold/15 text-gold font-serif font-bold text-[10px] flex flex-col items-center justify-center">
                      P{p.period}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-xavier-dark truncate">{p.subject}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.startTime}–{p.endTime} • {p.classGrade}
                        {p.teacher && ` • ${p.teacher}`}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditing(p); setShowForm(true); }}
                        className="size-7 rounded-md bg-xavier/10 text-xavier-dark hover:bg-xavier/20 flex items-center justify-center"
                        aria-label="Edit"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="size-7 rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TimetableForm({ initial, onSave, onCancel }: {
  initial: TimetableEntry | null;
  onSave: (e: Partial<TimetableEntry>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    id: initial?.id || "",
    day: initial?.day || "Monday",
    period: initial?.period || 1,
    startTime: initial?.startTime || "08:00",
    endTime: initial?.endTime || "08:45",
    subject: initial?.subject || "",
    classGrade: initial?.classGrade || "Class 6",
    teacher: initial?.teacher || "",
    room: initial?.room || "",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gold/30 bg-card p-5 mb-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-xavier-dark">{initial ? "Edit Entry" : "Add New Entry"}</h3>
        <button onClick={onCancel} className="size-7 rounded-md bg-xavier/10 text-xavier-dark flex items-center justify-center"><X className="size-4" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Day">
          <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm">
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Period #">
          <input type="number" min={1} value={form.period} onChange={(e) => setForm({ ...form, period: Number(e.target.value) })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Start Time">
          <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="End Time">
          <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Subject" required>
          <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Class / Grade">
          <input type="text" value={form.classGrade} onChange={(e) => setForm({ ...form, classGrade: e.target.value })} placeholder="e.g. Class 6, Nursery" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Teacher (optional)">
          <input type="text" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} placeholder="e.g. Mr. Sharma" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Room (optional)">
          <input type="text" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="e.g. Room 12" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <button onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:text-xavier-dark">Cancel</button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.subject.trim()}
          className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60"
        >
          <Check className="size-4" /> {initial ? "Update" : "Create"}
        </button>
      </div>
    </motion.div>
  );
}

/* =================== FEES MANAGER =================== */
function FeesManager() {
  const [rows, setRows] = useState<FeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FeeRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/fees");
        const data = await res.json();
        if (!cancelled && data.ok) setRows(data.rows);
      } catch (e) { console.error("Admin error:", e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const load = () => setReloadKey((k) => k + 1);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this fee row?")) return;
    await fetch(`/api/admin/fees?id=${id}`, { method: "DELETE" });
    setRows((list) => list.filter((r) => r.id !== id));
  };

  const onSave = async (row: Partial<FeeRow>) => {
    if (row.id) {
      const res = await fetch("/api/admin/fees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(row) });
      const data = await res.json();
      if (data.ok) setRows((list) => list.map((r) => r.id === row.id ? data.row : r));
    } else {
      const res = await fetch("/api/admin/fees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(row) });
      const data = await res.json();
      if (data.ok) setRows((list) => [...list, data.row]);
    }
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-xavier-dark">Fee Structure</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{rows.length} rows • visible on public site</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="size-9 rounded-full bg-card border border-xavier/10 flex items-center justify-center text-xavier-dark hover:bg-xavier/5" aria-label="Refresh">
            <RefreshCw className="size-4" />
          </button>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-xs sm:text-sm font-semibold text-cream shadow-glow-xavier"
          >
            <Plus className="size-4" /> Add Fee Row
          </button>
        </div>
      </div>

      {showForm && (
        <FeeForm initial={editing} onSave={onSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      {loading ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="size-4 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
          <Receipt className="size-10 mx-auto mb-3 text-gold/40" />
          No fee rows yet. Click &ldquo;Add Fee Row&rdquo; to begin.
        </div>
      ) : (
        <div className="rounded-2xl border border-xavier/10 bg-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2.5 bg-xavier/5 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            <div className="col-span-4">Label</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Frequency</div>
            <div className="col-span-2 text-right">Amount (₹)</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <div className="divide-y divide-xavier/5">
            {rows.map((r) => (
              <div key={r.id} className="px-4 py-3 grid grid-cols-12 gap-3 items-center group">
                <div className="col-span-12 sm:col-span-4">
                  <p className="font-semibold text-sm text-xavier-dark">{r.label}</p>
                  {r.note && <p className="text-[10px] text-muted-foreground">{r.note}</p>}
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <span className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold/15 text-gold font-semibold">{r.category}</span>
                </div>
                <div className="col-span-4 sm:col-span-2 text-xs text-muted-foreground">{r.frequency}</div>
                <div className="col-span-4 sm:col-span-2 text-right font-serif font-bold text-xavier-dark tabular-nums">₹ {r.amount.toLocaleString('en-IN')}</div>
                <div className="col-span-12 sm:col-span-2 flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(r); setShowForm(true); }} className="size-7 rounded-md bg-xavier/10 text-xavier-dark hover:bg-xavier/20 flex items-center justify-center">
                    <Edit2 className="size-3.5" />
                  </button>
                  <button onClick={() => onDelete(r.id)} className="size-7 rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeeForm({ initial, onSave, onCancel }: {
  initial: FeeRow | null;
  onSave: (r: Partial<FeeRow>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    id: initial?.id || "",
    label: initial?.label || "",
    amount: initial?.amount || 0,
    frequency: initial?.frequency || "Yearly",
    category: initial?.category || "general",
    note: initial?.note || "",
    order: initial?.order || 0,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gold/30 bg-card p-5 mb-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-xavier-dark">{initial ? "Edit Fee Row" : "Add New Fee Row"}</h3>
        <button onClick={onCancel} className="size-7 rounded-md bg-xavier/10 text-xavier-dark flex items-center justify-center"><X className="size-4" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Label" required>
          <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Tuition Fee" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Amount (₹)">
          <input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Frequency">
          <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm">
            {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Display Order">
          <input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Note (optional)">
          <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Concession for siblings" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <button onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:text-xavier-dark">Cancel</button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.label.trim()}
          className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60"
        >
          <Check className="size-4" /> {initial ? "Update" : "Create"}
        </button>
      </div>
    </motion.div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
        {label} {required && <span className="text-xavier">*</span>}
      </label>
      {children}
    </div>
  );
}

/* =================== NOTICES MANAGER =================== */
function NoticesManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/notices");
        const data = await res.json();
        if (!cancelled && data.ok) setNotices(data.notices);
      } catch (e) { console.error("Admin error:", e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const load = () => setReloadKey((k) => k + 1);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    await fetch(`/api/admin/notices?id=${id}`, { method: "DELETE" });
    setNotices((list) => list.filter((n) => n.id !== id));
  };

  const onSave = async (n: Partial<Notice>) => {
    if (n.id) {
      const res = await fetch("/api/admin/notices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(n) });
      const data = await res.json();
      if (data.ok) setNotices((list) => list.map((x) => x.id === n.id ? data.notice : x));
    } else {
      const res = await fetch("/api/admin/notices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(n) });
      const data = await res.json();
      if (data.ok) setNotices((list) => [...list, data.notice]);
    }
    setEditing(null);
    setShowForm(false);
  };

  const toggleActive = async (n: Notice) => {
    const res = await fetch("/api/admin/notices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id, active: !n.active }) });
    const data = await res.json();
    if (data.ok) setNotices((list) => list.map((x) => x.id === n.id ? data.notice : x));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-xavier-dark">Notices</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{notices.length} notices • {notices.filter(n => n.active).length} active • scroll on top of site</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="size-9 rounded-full bg-card border border-xavier/10 flex items-center justify-center text-xavier-dark hover:bg-xavier/5" aria-label="Refresh">
            <RefreshCw className="size-4" />
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-xs sm:text-sm font-semibold text-cream shadow-glow-xavier">
            <Plus className="size-4" /> Add Notice
          </button>
        </div>
      </div>

      {showForm && <NoticeForm initial={editing} onSave={onSave} onCancel={() => { setShowForm(false); setEditing(null); }} />}

      {loading ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="size-4 animate-spin" /> Loading…
        </div>
      ) : notices.length === 0 ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
          <Megaphone className="size-10 mx-auto mb-3 text-gold/40" />
          No notices yet. Click &quot;Add Notice&quot; to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {notices.map((n) => (
            <div key={n.id} className="rounded-xl border border-xavier/10 bg-card p-4 flex items-start gap-3 group">
              <div className={`size-2 rounded-full mt-2 shrink-0 ${n.active ? "bg-green-500" : "bg-gray-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{n.text}</p>
                {n.link && <p className="text-xs text-muted-foreground mt-1">Link: {n.link}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">Order: {n.order} • {n.active ? "Active" : "Inactive"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggleActive(n)} className={`size-7 rounded-md flex items-center justify-center text-xs font-bold ${n.active ? "bg-green-500/15 text-green-700" : "bg-gray-500/15 text-gray-600"}`} title={n.active ? "Deactivate" : "Activate"}>
                  {n.active ? "ON" : "OFF"}
                </button>
                <button onClick={() => { setEditing(n); setShowForm(true); }} className="size-7 rounded-md bg-xavier/10 text-xavier-dark hover:bg-xavier/20 flex items-center justify-center">
                  <Edit2 className="size-3.5" />
                </button>
                <button onClick={() => onDelete(n.id)} className="size-7 rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NoticeForm({ initial, onSave, onCancel }: { initial: Notice | null; onSave: (n: Partial<Notice>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: initial?.id || "",
    text: initial?.text || "",
    link: initial?.link || "",
    active: initial?.active ?? true,
    order: initial?.order || 0,
  });
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gold/30 bg-card p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-xavier-dark">{initial ? "Edit Notice" : "Add New Notice"}</h3>
        <button onClick={onCancel} className="size-7 rounded-md bg-xavier/10 text-xavier-dark flex items-center justify-center"><X className="size-4" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Field label="Notice Text" required>
            <input type="text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="e.g. Admissions Open 2026-27" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
          </Field>
        </div>
        <Field label="Link (optional)">
          <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="e.g. #admissions" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Order">
          <input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
      </div>
      <label className="flex items-center gap-2 mt-3 text-sm">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="size-4" />
        Active (show on public site)
      </label>
      <div className="mt-4 flex gap-2 justify-end">
        <button onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:text-xavier-dark">Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.text.trim()} className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60">
          <Check className="size-4" /> {initial ? "Update" : "Create"}
        </button>
      </div>
    </motion.div>
  );
}

/* =================== FAQS MANAGER =================== */
function FaqsManager() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/faqs");
        const data = await res.json();
        if (!cancelled && data.ok) setFaqs(data.faqs);
      } catch (e) { console.error("Admin error:", e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const load = () => setReloadKey((k) => k + 1);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
    setFaqs((list) => list.filter((f) => f.id !== id));
  };

  const onSave = async (f: Partial<FaqItem>) => {
    if (f.id) {
      const res = await fetch("/api/admin/faqs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const data = await res.json();
      if (data.ok) setFaqs((list) => list.map((x) => x.id === f.id ? data.faq : x));
    } else {
      const res = await fetch("/api/admin/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const data = await res.json();
      if (data.ok) setFaqs((list) => [...list, data.faq]);
    }
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-xavier-dark">FAQs</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{faqs.length} FAQs • visible on public site</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="size-9 rounded-full bg-card border border-xavier/10 flex items-center justify-center text-xavier-dark hover:bg-xavier/5" aria-label="Refresh">
            <RefreshCw className="size-4" />
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-xs sm:text-sm font-semibold text-cream shadow-glow-xavier">
            <Plus className="size-4" /> Add FAQ
          </button>
        </div>
      </div>

      {showForm && <FaqForm initial={editing} onSave={onSave} onCancel={() => { setShowForm(false); setEditing(null); }} />}

      {loading ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="size-4 animate-spin" /> Loading…
        </div>
      ) : faqs.length === 0 ? (
        <div className="rounded-2xl border border-xavier/10 bg-card p-10 text-center text-muted-foreground">
          <HelpCircle className="size-10 mx-auto mb-3 text-gold/40" />
          No FAQs yet. Click &quot;Add FAQ&quot; to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-xl border border-xavier/10 bg-card p-4 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold/15 text-gold font-semibold">{f.category}</span>
                    {!f.active && <span className="text-[10px] uppercase text-gray-500">Inactive</span>}
                  </div>
                  <p className="font-serif font-bold text-sm text-xavier-dark">{f.question}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditing(f); setShowForm(true); }} className="size-7 rounded-md bg-xavier/10 text-xavier-dark hover:bg-xavier/20 flex items-center justify-center">
                    <Edit2 className="size-3.5" />
                  </button>
                  <button onClick={() => onDelete(f.id)} className="size-7 rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 flex items-center justify-center">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqForm({ initial, onSave, onCancel }: { initial: FaqItem | null; onSave: (f: Partial<FaqItem>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    id: initial?.id || "",
    question: initial?.question || "",
    answer: initial?.answer || "",
    category: initial?.category || "general",
    order: initial?.order || 0,
    active: initial?.active ?? true,
  });
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gold/30 bg-card p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-xavier-dark">{initial ? "Edit FAQ" : "Add New FAQ"}</h3>
        <button onClick={onCancel} className="size-7 rounded-md bg-xavier/10 text-xavier-dark flex items-center justify-center"><X className="size-4" /></button>
      </div>
      <div className="space-y-3">
        <Field label="Question" required>
          <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="e.g. What is the age criteria for Nursery?" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
        </Field>
        <Field label="Answer" required>
          <textarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Detailed answer…" className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm resize-y" />
        </Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Category">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm">
              <option value="general">General</option>
              <option value="admissions">Admissions</option>
              <option value="academics">Academics</option>
              <option value="facilities">Facilities</option>
            </select>
          </Field>
          <Field label="Order">
            <input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm" />
          </Field>
          <Field label="Active">
            <select value={form.active ? "yes" : "no"} onChange={(e) => setForm({ ...form, active: e.target.value === "yes" })} className="w-full rounded-lg border border-xavier/15 bg-white px-3 py-2 text-sm">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <button onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:text-xavier-dark">Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.question.trim() || !form.answer.trim()} className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60">
          <Check className="size-4" /> {initial ? "Update" : "Create"}
        </button>
      </div>
    </motion.div>
  );
}
