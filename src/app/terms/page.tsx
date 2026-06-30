import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { BackToTop } from "@/components/site/back-to-top";
import { StickyApplyBar } from "@/components/site/sticky-apply-bar";
import { HindiOverlay } from "@/components/site/hindi-overlay";
import { SCHOOL } from "@/lib/site/data";

export const metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using the St. Xavier's Jr./Sr. School, Muzaffarpur website.",
};

export default function TermsPage() {
  return (
    <HindiOverlay>
      <div className="relative min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto max-w-4xl px-5 sm:px-6 py-12 sm:py-20">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink mb-2">Terms of Use</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

          <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm">By accessing and using this website, you accept and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our website.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">2. Use of the Website</h2>
              <p className="text-sm mb-2">You agree to use this website only for lawful purposes. You must not:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm">
                <li>Submit false or misleading information via the enquiry form.</li>
                <li>Attempt to gain unauthorized access to admin areas or backend systems.</li>
                <li>Use automated scripts (bots) to spam the contact form or overwhelm our servers.</li>
                <li>Reproduce, copy, or distribute content without permission.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">3. Intellectual Property</h2>
              <p className="text-sm">All content on this website — including text, images, logos, graphics, and design — is the property of St. Xavier's Jr./Sr. School, Muzaffarpur, unless otherwise stated. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
              <p className="text-sm mt-2">The school name, logo, and brand identity are protected trademarks.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">4. Enquiry Submissions</h2>
              <p className="text-sm">When you submit the enquiry form, you confirm that the information provided is accurate and complete. You grant us permission to contact you regarding your enquiry using the email or phone number provided. You can withdraw this consent at any time by emailing us.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">5. Fee Structure</h2>
              <p className="text-sm">The fee structure displayed on this website is indicative and may change without notice. For the most current and class-specific fee details, please contact the school office directly. Payment of fees is governed by the school's separate fee policy, available at the school office.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">6. External Links</h2>
              <p className="text-sm">Our website may contain links to external sites (Instagram, Facebook, Google Maps). We are not responsible for the content or privacy practices of these third-party sites. We recommend reviewing their terms and privacy policies.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">7. Disclaimer</h2>
              <p className="text-sm">The information on this website is provided in good faith. We make no representations or warranties of any kind regarding completeness, accuracy, or reliability. School policies, schedules, and fee structures may change — always verify with the school office.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">8. Limitation of Liability</h2>
              <p className="text-sm">St. Xavier's Jr./Sr. School shall not be liable for any direct, indirect, or consequential damages arising from the use of this website or reliance on any information contained herein.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">9. Changes to Terms</h2>
              <p className="text-sm">We reserve the right to update these Terms of Use at any time. Changes will be posted on this page with an updated revision date. Continued use of the website after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">10. Governing Law</h2>
              <p className="text-sm">These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts in Muzaffarpur, Bihar.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-3">11. Contact</h2>
              <div className="rounded-xl border border-xavier/10 bg-card p-4 text-sm">
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
