import { PageLayout } from "@/components/site/page-layout";
import { NoticesList } from "./notices-list";

export const metadata = {
  title: "Notice Board",
  description: "School circulars, holiday notices, exam dates, and important announcements from St. Xavier's Jr./Sr. School, Muzaffarpur.",
  alternates: { canonical: "https://xavierpreview.vercel.app/notices" },
};

type Notice = {
  id: string;
  title: string;
  category: "General" | "Holiday" | "Exam" | "Admission" | "Event" | "Circular";
  date: string;
  priority: "high" | "medium" | "low";
  summary: string;
};

const NOTICES: Notice[] = [
  {
    id: "1",
    title: "Admissions Open for Academic Session 2026-27",
    category: "Admission",
    date: "2026-01-15",
    priority: "high",
    summary: "Admissions are now open for Nursery to Class 11 for the academic session 2026-27. Registration forms available at the school office. Limited seats — apply early!",
  },
  {
    id: "2",
    title: "AISSCE 2026 Result Declared — 100% Pass",
    category: "Exam",
    date: "2026-05-20",
    priority: "high",
    summary: "Class 12 board results declared. 100% pass percentage. Krishna Saraf topped with 97.2%. Congratulations to all students and teachers!",
  },
  {
    id: "3",
    title: "Summer Vacation Notice",
    category: "Holiday",
    date: "2026-05-10",
    priority: "high",
    summary: "School will remain closed for summer vacation from 15th May to 25th June 2026. School reopens on 26th June 2026. Office will remain open 9 AM - 12 PM on weekdays.",
  },
  {
    id: "4",
    title: "Swimming Pool & Sports Academy Enrolment",
    category: "Event",
    date: "2026-04-05",
    priority: "medium",
    summary: "Swimming pool and Sports Academy enrolment open for new students. Contact the school office for registration and fee details.",
  },
  {
    id: "5",
    title: "Unit Test 1 Schedule — Classes 6 to 12",
    category: "Exam",
    date: "2026-07-01",
    priority: "medium",
    summary: "Unit Test 1 for Classes 6-12 will commence from 15th July 2026. Detailed date sheet available with class teachers. Syllabus uploaded on school portal.",
  },
  {
    id: "6",
    title: "Parent-Teacher Meeting (PTM)",
    category: "Event",
    date: "2026-08-10",
    priority: "medium",
    summary: "PTM for all classes scheduled for 10th August 2026, 9:00 AM to 12:00 PM. Parents are requested to attend and collect Unit Test 1 report cards.",
  },
  {
    id: "7",
    title: "Independence Day Celebration",
    category: "Event",
    date: "2026-08-15",
    priority: "low",
    summary: "Independence Day will be celebrated on 15th August 2026. Flag hoisting at 8:00 AM followed by cultural programme. Students to arrive by 7:45 AM in school uniform.",
  },
  {
    id: "8",
    title: "Diwali Break Notice",
    category: "Holiday",
    date: "2026-10-20",
    priority: "medium",
    summary: "School will remain closed for Diwali break from 20th October to 30th October 2026. School reopens on 31st October 2026.",
  },
  {
    id: "9",
    title: "Annual Day 2026 — Save the Date",
    category: "Event",
    date: "2026-12-15",
    priority: "medium",
    summary: "Annual Day celebration scheduled for 15th December 2026 at the school auditorium. Cultural performances, prize distribution, and more. Invitations will be sent separately.",
  },
  {
    id: "10",
    title: "School Transport Route Update",
    category: "Circular",
    date: "2026-06-01",
    priority: "low",
    summary: "New transport routes added for Sitamarhi and Hajipur. Updated fee structure for new routes available at the school office. Existing routes unchanged.",
  },
  {
    id: "11",
    title: "Winter Timings Effective",
    category: "Circular",
    date: "2026-11-01",
    priority: "medium",
    summary: "Winter timings effective from 1st November 2026: Nursery-UKG 9:00 AM - 12:30 PM, Classes 1-12 9:00 AM - 3:00 PM. Office hours 9:00 AM - 2:00 PM.",
  },
  {
    id: "12",
    title: "Christmas Carnival 2026",
    category: "Event",
    date: "2026-12-23",
    priority: "low",
    summary: "Annual Christmas Carnival on 23rd December 2026. Games, food stalls, and cultural programmes. Open to all students and parents. Entry free.",
  },
];

export default function NoticesPage() {
  return (
    <PageLayout
      badge="STAY UPDATED"
      title={<>Notice <span className="text-gradient-xavier">Board</span></>}
      subtitle="School circulars, holiday notices, exam dates, and important announcements. Check back regularly for updates."
    >
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-4xl px-5 sm:px-6">
          <NoticesList notices={NOTICES} />
        </div>
      </section>
    </PageLayout>
  );
}
