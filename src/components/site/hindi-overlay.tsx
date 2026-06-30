'use client';

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/site/language-provider";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Stats } from "@/components/site/stats";
import { Marquee } from "@/components/site/marquee";
import { About } from "@/components/site/about";
import { Features } from "@/components/site/features";
import { Academics } from "@/components/site/academics";
import { Admissions } from "@/components/site/admissions";
import { Fees } from "@/components/site/fees";
import { FAQ } from "@/components/site/faq";
import { Facilities } from "@/components/site/facilities";
import { Gallery } from "@/components/site/gallery";
import { Leadership } from "@/components/site/leadership";
import { Testimonials } from "@/components/site/testimonials";
import { Timetable } from "@/components/site/timetable";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { BackToTop } from "@/components/site/back-to-top";
import { NoticeTicker } from "@/components/site/notice-ticker";
import { SCHOOL } from "@/lib/site/data";

// Hindi translations for ALL visible text
const hi = {
  // Notice ticker
  notice_label: "सूचना",
  notice_dismiss: "बंद करें",
  
  // Nav
  nav_home: "होम",
  nav_about: "हमारे बारे में",
  nav_academics: "शिक्षा",
  nav_campus: "परिसर",
  nav_gallery: "गैलरी",
  nav_timetable: "समय सारिणी",
  nav_fees: "शुल्क",
  nav_admissions: "प्रवेश",
  nav_contact: "संपर्क",
  nav_apply: "अभी आवेदन करें",
  
  // Hero
  hero_badge: "प्रवेश खुले हैं 2026-27",
  hero_title: "जहाँ अनुशासन मिलता है अवसर से",
  hero_subtitle: "1976 से मन का पोषण, चरित्र निर्माण, भविष्य की रूपरेखा।",
  hero_cta_primary: "अपनी यात्रा शुरू करें",
  hero_cta_secondary: "परिसर भ्रमण बुक करें",
  hero_stat_students: "विद्यार्थी",
  hero_stat_years: "उत्कृष्टता के वर्ष",
  hero_stat_teachers: "कुशल शिक्षक",
  hero_stat_books: "पुस्तकालय पुस्तकें",
  
  // Marquee
  marquee_cbse: "सीबीएसई संबद्ध",
  marquee_smart: "स्मार्ट कक्षाएं",
  marquee_boarding: "दिवस विद्यार्थी + छात्रावास",
  marquee_range: "नर्सरी → कक्षा 12",
  marquee_coed: "सह-शिक्षा",
  marquee_holistic: "समग्र विकास",
  marquee_faculty: "विशेषज्ञ संकाय",
  marquee_labs: "आधुनिक प्रयोगशालाएं",
  marquee_sports: "खेल अकादमी",
  marquee_cultural: "सांस्कृतिक उत्कृष्टता",
  
  // About
  about_badge: "हमारे विद्यालय के बारे में",
  about_title: "उत्कृष्टता की विरासत",
  about_subtitle: "शिक्षा में लगभग पाँच दशकों की विरासत",
  
  // Academics
  academics_badge: "शैक्षणिक उत्कृष्टता",
  academics_title: "शिक्षा",
  academics_subtitle: "हर स्तर पर उत्कृष्टता",
  
  // Admissions
  admissions_badge: "प्रवेश प्रक्रिया",
  admissions_title: "2026-27 के लिए प्रवेश खुले हैं",
  admissions_subtitle: "आपके बच्चे की उत्कृष्टता की यात्रा यहाँ से शुरू",
  admissions_apply: "प्रवेश हेतु आवेदन करें",
  admissions_enquiry: "पूछताछ भेजें",
  
  // Fees
  fees_title: "शुल्क संरचना",
  fees_subtitle: "पारदर्शी और प्रतिस्पर्धी",
  
  // FAQ
  faq_title: "अक्सर पूछे जाने वाले प्रश्न",
  faq_subtitle: "जो आप जानना चाहते हैं",
  
  // Contact
  contact_title: "संपर्क करें",
  contact_subtitle: "हम आपसे सुनना चाहेंगे",
  contact_name: "आपका नाम",
  contact_email: "ईमेल पता",
  contact_phone: "फ़ोन नंबर",
  contact_grade: "कक्षा",
  contact_message: "आपका संदेश",
  contact_submit: "पूछताछ भेजें",
  contact_success: "पूछताछ प्राप्त हुई!",
  contact_success_desc: "सेंट ज़ेवियर्स में संपर्क करने के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।",
  
  // Footer
  footer_title: "अपने बच्चे को ज़ेवियर्स का लाभ देने के लिए तैयार हैं?",
  footer_subtitle: "नर्सरी से कक्षा 12 तक प्रवेश खुले हैं। सीमित सीटें — जल्दी आवेदन करें।",
  footer_apply: "अभी आवेदन करें",
  footer_rights: "सर्वाधिकार सुरक्षित।",
  footer_credit: "Amrit Web Solutions द्वारा निर्मित",
};

// This component applies Hindi translations by overriding text content
export function HindiOverlay({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (lang !== 'hi' || !ready) return;

    // Apply Hindi translations to all text nodes
    const translateText = (original: string): string => {
      const trimmed = original.trim();
      if (!trimmed) return original;
      
      // Translation replacements for common phrases
      const replacements: Record<string, string> = {
        "Apply Now": "अभी आवेदन करें",
        "Apply for Admission": "प्रवेश हेतु आवेदन करें",
        "Send an Enquiry": "पूछताछ भेजें",
        "Send Another Enquiry": "एक और पूछताछ भेजें",
        "Begin Your Journey": "अपनी यात्रा शुरू करें",
        "Book a Campus Visit": "परिसर भ्रमण बुक करें",
        "Where Discipline Meets Opportunity": "जहाँ अनुशासन मिलता है अवसर से",
        "Nurturing minds, building character, shaping futures": "मन का पोषण, चरित्र निर्माण, भविष्य की रूपरेखा",
        "About Our School": "हमारे विद्यालय के बारे में",
        "Academics": "शिक्षा",
        "Admissions Open for 2026-27": "2026-27 के लिए प्रवेश खुले हैं",
        "Fee Structure": "शुल्क संरचना",
        "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
        "Get in Touch": "संपर्क करें",
        "Your Name": "आपका नाम",
        "Email Address": "ईमेल पता",
        "Phone Number": "फ़ोन नंबर",
        "Grade Interested In": "कक्षा",
        "Your Message": "आपका संदेश",
        "Send Enquiry": "पूछताछ भेजें",
        "Enquiry Received!": "पूछताछ प्राप्त हुई!",
        "Loading fee structure…": "शुल्क संरचना लोड हो रही है…",
        "Loading FAQs…": "अक्सर पूछे जाने वाले प्रश्न लोड हो रहे हैं…",
        "Loading timetable…": "समय सारिणी लोड हो रही है…",
        "CBSE Affiliated": "सीबीएसई संबद्ध",
        "Smart Classes": "स्मार्ट कक्षाएं",
        "Day Scholar + Boarding": "दिवस विद्यार्थी + छात्रावास",
        "Nursery → Class 12": "नर्सरी → कक्षा 12",
        "Co-Educational": "सह-शिक्षा",
        "Holistic Development": "समग्र विकास",
        "Expert Faculty": "विशेषज्ञ संकाय",
        "Modern Labs": "आधुनिक प्रयोगशालाएं",
        "Sports Academy": "खेल अकादमी",
        "Cultural Excellence": "सांस्कृतिक उत्कृष्टता",
        "Students": "विद्यार्थी",
        "Years of Excellence": "उत्कृष्टता के वर्ष",
        "Skilled Teachers": "कुशल शिक्षक",
        "Library Books": "पुस्तकालय पुस्तकें",
        "Ready to give your child the Xavier's edge?": "अपने बच्चे को ज़ेवियर्स का लाभ देने के लिए तैयार हैं?",
        "All rights reserved.": "सर्वाधिकार सुरक्षित।",
        "Home": "होम",
        "About": "हमारे बारे में",
        "Campus": "परिसर",
        "Gallery": "गैलरी",
        "Timetable": "समय सारिणी",
        "Fees": "शुल्क",
        "Admissions": "प्रवेश",
        "Contact": "संपर्क",
      };
      
      return replacements[trimmed] || original;
    };

    // Walk all text nodes and translate
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          // Skip script, style, and input elements
          const tag = parent.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'input' || tag === 'textarea') {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip elements with data-no-translate
          if (parent.dataset.noTranslate !== undefined) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.textContent && node.textContent.trim()) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      nodes.push(node as Text);
    }

    nodes.forEach(textNode => {
      const original = textNode.textContent;
      if (!original) return;
      const translated = translateText(original);
      if (translated !== original) {
        textNode.textContent = translated;
      }
    });

    // Also translate placeholder attributes
    document.querySelectorAll<HTMLInputElement>('[placeholder]').forEach(el => {
      const original = el.placeholder;
      if (!original) return;
      const replacements: Record<string, string> = {
        "Your Name": "आपका नाम",
        "you@example.com": "आप@उदाहरण.com",
        "+91 90000 00000": "+91 90000 00000",
        "Grade Interested In": "कक्षा",
        "Your Message": "आपका संदेश",
      };
      if (replacements[original]) {
        el.placeholder = replacements[original];
      }
    });

  }, [lang, ready]);

  // When switching back to English, reload the page to restore original text
  useEffect(() => {
    if (lang === 'en' && ready) {
      // Check if any text was translated (page was in Hindi before)
      const wasTranslated = document.body.dataset.hiActive === 'true';
      if (wasTranslated) {
        document.body.dataset.hiActive = 'false';
        window.location.reload();
      }
    }
    if (lang === 'hi') {
      document.body.dataset.hiActive = 'true';
    }
  }, [lang, ready]);

  return <>{children}</>;
}
