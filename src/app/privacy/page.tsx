import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { BackToTop } from "@/components/site/back-to-top";
import { StickyApplyBar } from "@/components/site/sticky-apply-bar";
import { HindiOverlay } from "@/components/site/hindi-overlay";
import { SCHOOL } from "@/lib/site/data";

export const metadata = {
  title: "Privacy Policy",
  description: "How St. Xavier's Jr./Sr. School, Muzaffarpur collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <HindiOverlay>
      <div className="relative min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto max-w-4xl px-5 sm:px-6 py-12 sm:py-20">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

          <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">1. Information We Collect</h2>
              <p className="mb-3">When you use our website or contact us, we may collect:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm">
                <li><strong>Enquiry Form Data:</strong> Your name, email address, phone number, child's interested grade, and message — only when you voluntarily submit the contact form.</li>
                <li><strong>Usage Data:</strong> Anonymous analytics data such as pages visited, time spent, and approximate location (city/region only, not precise).</li>
                <li><strong>Admin Logs:</strong> When admin staff log in, we record the IP address and action taken for security audit purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1.5 text-sm">
                <li>To respond to your admission enquiries and provide information about our school.</li>
                <li>To contact you regarding admissions, fees, or school-related matters.</li>
                <li>To improve our website and services based on anonymous usage analytics.</li>
                <li>To maintain security logs for audit purposes.</li>
              </ul>
              <p className="mt-3 text-sm">We <strong>never</strong> sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">3. Data Storage & Security</h2>
              <p className="text-sm">Your enquiry data is stored securely on our hosting provider's servers. Access is restricted to authorized school staff only. Admin sessions are protected with signed cookies and rate-limited login. All communications are encrypted via HTTPS.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">4. Data Retention</h2>
              <p className="text-sm">Enquiry submissions are retained for up to <strong>2 years</strong> from the date of submission, after which they are automatically deleted. If you become a student/parent at the school, your data may be retained as part of school records per CBSE guidelines.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">5. Your Rights</h2>
              <p className="text-sm mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm">
                <li>Request a copy of the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data (subject to legal requirements).</li>
                <li>Opt out of any communications at any time.</li>
              </ul>
              <p className="mt-3 text-sm">To exercise these rights, email us at <a href={`mailto:${SCHOOL.email}`} className="text-xavier-dark underline">{SCHOOL.email}</a>.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">6. Cookies</h2>
              <p className="text-sm">Our website uses essential cookies for functioning (theme preference, language preference, admin session). We do not use third-party advertising cookies. Analytics cookies, if enabled, are anonymous and used solely to improve the site.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">7. Children's Privacy</h2>
              <p className="text-sm">Our website is designed for parents and guardians making admission enquiries. We do not knowingly collect personal information directly from children under 13. All enquiries are submitted by adults.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">8. Contact Us</h2>
              <p className="text-sm">For any privacy-related questions or requests, please contact:</p>
              <div className="mt-3 rounded-xl border border-xavier/10 bg-card p-4 text-sm">
                <p className="font-semibold text-xavier-dark">St. Xavier's Jr./Sr. School</p>
                <p>{SCHOOL.addressLine}</p>
                <p>Phone: +91 {SCHOOL.phones[0]}</p>
                <p>Email: <a href={`mailto:${SCHOOL.email}`} className="text-xavier-dark underline">{SCHOOL.email}</a></p>
              </div>
            </section>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <StickyApplyBar />
      </div>
    </HindiOverlay>
  );
}
