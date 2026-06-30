'use client';

import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/components/site/language-provider";

export function HindiOverlay({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  useEffect(() => {
    if (lang !== 'hi' || !ready) return;

    // Complete Hindi translation map — covers ALL visible English text on the site
    // Names (school name, people, facilities like Swimming Pool) stay in English
    const replacements: Record<string, string> = {
      // ═══ NAV ═══
      "Home": "होम",
      "About": "हमारे बारे में",
      "About Us": "हमारे बारे में",
      "Academics": "शिक्षा",
      "Campus": "परिसर",
      "Campus & Facilities": "परिसर और सुविधाएँ",
      "Gallery": "गैलरी",
      "Timetable": "समय सारिणी",
      "Fees": "शुल्क",
      "Admissions": "प्रवेश",
      "Contact": "संपर्क",
      "Quick Links": "त्वरित लिंक",
      "Follow Us": "हमें फ़ॉलो करें",
      "Staff": "कर्मचारी",

      // ═══ HERO ═══
      "Begin Your Journey": "अपनी यात्रा शुरू करें",
      "Book a Campus Visit": "परिसर भ्रमण बुक करें",
      "Admissions Open · Session 2026–27": "प्रवेश खुले हैं · सत्र 2026–27",
      "Nurturing curious minds since 1976, on Goshala Road, Muzaffarpur.": "1976 से गोशाला रोड, मुजफ्फरपुर में जिज्ञासु मन का पोषण।",

      // ═══ STATS ═══
      "Students": "विद्यार्थी",
      "Year of Establishment": "स्थापना वर्ष",
      "Nearly five decades of legacy": "लगभग पाँच दशकों की विरासत",
      "Students Enrolled": "नामांकित विद्यार्थी",
      "Across Nursery to Class XII": "नर्सरी से कक्षा 12 तक",
      "Skilled Teachers": "कुशल शिक्षक",
      "Dedicated & experienced faculty": "समर्पित और अनुभवी संकाय",
      "Library Books": "पुस्तकालय पुस्तकें",
      "Reading culture since 1976": "1976 से पठन संस्कृति",

      // ═══ MARQUEE ═══
      "CBSE Affiliated": "सीबीएसई संबद्ध",
      "Smart Classes": "स्मार्ट कक्षाएं",
      "Day School": "दिवस विद्यालय",
      "Nursery → Class 12": "नर्सरी → कक्षा 12",
      "Co-Educational": "सह-शिक्षा",
      "Holistic Development": "समग्र विकास",
      "Expert Faculty": "विशेषज्ञ संकाय",
      "Modern Labs": "आधुनिक प्रयोगशालाएं",
      "Cultural Excellence": "सांस्कृतिक उत्कृष्टता",

      // ═══ ABOUT ═══
      "Our Mission": "हमारा मिशन",
      "Our Vision": "हमारा विजन",
      "A legacy of": "की विरासत",
      "excellence": "उत्कृष्टता",
      "on": "पर",
      "Goshala Road": "गोशाला रोड",
      "Principal's Message": "प्रधानाचार्य का संदेश",
      "Founded in": "स्थापित",
      "and administered by the": "द्वारा प्रशासित",
      "under the chairmanship of": "की अध्यक्षता में",
      "is a Co-Educational English Medium School affiliated to CBSE, New Delhi, up to 10+2 level.": "एक सह-शिक्षा अंग्रेज़ी माध्यम विद्यालय है जो सीबीएसई, नई दिल्ली से 10+2 स्तर तक संबद्ध है।",

      // ═══ ACADEMICS ═══
      "Academic Excellence": "शैक्षणिक उत्कृष्टता",
      "Pre-Primary": "प्राथमिक पूर्व",
      "Primary": "प्राथमिक",
      "Middle School": "माध्यमिक",
      "Secondary": "माध्यमिक",
      "Senior Secondary": "उच्च माध्यमिक",
      "Streams": "संकाय",
      "100% Result": "100% परिणाम",
      "Class timetable.": "कक्षा समय सारिणी।",

      // ═══ ADMISSIONS ═══
      "Admissions Open • Session 2026 – 27": "प्रवेश खुले हैं • सत्र 2026 – 27",
      "Your child's journey to excellence starts here": "आपके बच्चे की उत्कृष्टता की यात्रा यहाँ से शुरू",
      "Registration": "पंजीकरण",
      "Collect & submit the Registration Form from the school office along with the registration fee and required documents.": "पंजीकरण शुल्क और आवश्यक दस्तावेज़ों के साथ विद्यालय कार्यालय से पंजीकरण फ़ॉर्म लें और जमा करें।",
      "~30 min at office": "कार्यालय में ~30 मिनट",
      "Interaction / Assessment": "संवाद / मूल्यांकन",
      "Offer & Confirmation": "प्रस्ताव और पुष्टि",
      "Fee Payment & Joining": "शुल्क भुगतान और प्रवेश",
      "Documents to bring": "लाने योग्य दस्तावेज़",
      "Keep these ready to make registration a breeze.": "पंजीकरण आसान बनाने के लिए ये तैयार रखें।",
      "Birth certificate (photocopy & original)": "जन्म प्रमाण पत्र (फ़ोटोकॉपी और मूल)",
      "4 recent passport-size photographs": "4 हाल की पासपोर्ट-साइज़ तस्वीरें",
      "Aadhaar card of student & parents": "विद्यार्थी और अभिभावक का आधार कार्ड",
      "Previous school's Transfer Certificate (Class 2+)": "पिछले विद्यालय का स्थानांतरण प्रमाण पत्र (कक्षा 2+)",
      "Last report card / mark sheet": "अंतिम रिपोर्ट कार्ड / अंक-सूची",
      "Caste / income certificate (if applicable)": "जाति / आय प्रमाण पत्र (यदि लागू हो)",
      "Apply for Admission": "प्रवेश हेतु आवेदन करें",
      "Apply Now": "अभी आवेदन करें",
      "Send an Enquiry": "पूछताछ भेजें",
      "Send Another Enquiry": "एक और पूछताछ भेजें",
      "Have a question about admissions or fees?": "प्रवेश या शुल्क के बारे में कोई प्रश्न?",

      // ═══ FEES ═══
      "Fee Structure": "शुल्क संरचना",
      "Transparent and competitive": "पारदर्शी और प्रतिस्पर्धी",
      "Particulars": "विवरण",
      "Category": "श्रेणी",
      "Frequency": "आवृत्ति",
      "Amount (₹)": "राशि (₹)",
      "Loading fee structure…": "शुल्क संरचना लोड हो रही है…",
      "Fee details will be published shortly. Please contact the school office for the latest structure.": "शुल्क विवरण शीघ्र प्रकाशित किए जाएंगे। नवीनतम संरचना के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",
      "Approx. Yearly Total": "अनुमानित वार्षिक कुल",
      "(excluding one-time fees)": "(एकमुश्त शुल्क छोड़कर)",
      "Admission": "प्रवेश शुल्क",
      "Tuition": "शिक्षण शुल्क",
      "Transport": "परिवहन",
      "Development": "विकास शुल्क",
      "All": "सभी",

      // ═══ FAQ ═══
      "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
      "Everything you need to know": "जो आप जानना चाहते हैं",
      "Loading FAQs…": "प्रश्न लोड हो रहे हैं…",
      "Failed to load FAQs. Please try again later.": "प्रश्न लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",

      // ═══ FACILITIES ═══
      "Campus &": "परिसर और",
      "Facilities": "सुविधाएँ",
      "Green Campus": "हरा-भरा परिसर",
      "Plus Sports Academy": "साथ में खेल अकादमी",
      "Residential & Day": "आवासीय और दिवस",
      "2+ acres": "2+ एकड़",

      // ═══ GALLERY ═══
      "Annual Day Group Photo": "वार्षिकोत्सव समूह फ़ोटो",
      "Dance Performance": "नृत्य प्रस्तुति",
      "Christmas Carnival": "क्रिसमस कार्निवल",
      "Indoor Games Session": "इनडोर खेल सत्र",
      "Campus Life": "परिसर जीवन",
      "School Gallery — 01": "विद्यालय गैलरी — 01",
      "School Gallery — 02": "विद्यालय गैलरी — 02",
      "School Gallery — 03": "विद्यालय गैलरी — 03",
      "Activities & Sports": "गतिविधियाँ और खेल",
      "Events": "कार्यक्रम",
      "Sports": "खेल",
      "Cultural": "सांस्कृतिक",

      // ═══ LEADERSHIP ═══
      "Leadership": "नेतृत्व",
      "Managing Director": "प्रबंध निदेशक",
      "Joint Director": "संयुक्त निदेशक",
      "Principal": "प्रधानाचार्य",

      // ═══ TESTIMONIALS ═══
      "What Our Community Says": "हमारा समुदाय क्या कहता है",
      "Parent of a Class 10 Student": "कक्षा 10 विद्यार्थी के अभिभावक",
      "Senior Secondary Student": "उच्च माध्यमिक विद्यार्थी",
      "Parent of Day Scholar": "दिवस विद्यार्थी के अभिभावक",

      // ═══ TIMETABLE ═══
      "Class": "कक्षा",
      "DAILY SCHEDULE • ACADEMIC SESSION 2026–27": "दैनिक कार्यक्रम • शैक्षणिक सत्र 2026–27",
      "Loading timetable…": "समय सारिणी लोड हो रही है…",
      "No entries": "कोई प्रविष्टि नहीं",
      "Monday": "सोमवार",
      "Tuesday": "मंगलवार",
      "Wednesday": "बुधवार",
      "Thursday": "गुरुवार",
      "Friday": "शुक्रवार",
      "Saturday": "शनिवार",

      // ═══ CONTACT ═══
      "Get in Touch": "संपर्क करें",
      "We'd love to hear from you": "हम आपसे सुनना चाहेंगे",
      "Visit / Reach Us": "भ्रमण करें / संपर्क करें",
      "Visit us on Goshala Road or send a quick enquiry — we'd love to meet your family.": "गोशाला रोड पर हमसे मिलें या एक त्वरित पूछताछ भेजें — हम आपके परिवार से मिलना चाहेंगे।",
      "Phone": "फ़ोन",
      "Email": "ईमेल",
      "Your Name": "आपका नाम",
      "Email Address": "ईमेल पता",
      "Phone Number": "फ़ोन नंबर",
      "Grade Interested In": "रुचि वाली कक्षा",
      "Message": "संदेश",
      "Send Enquiry": "पूछताछ भेजें",
      "Sending…": "भेजा जा रहा है…",
      "Enquiry Received!": "पूछताछ प्राप्त हुई!",
      "Thank you for reaching out to St. Xavier's. We've received your enquiry and will get back to you shortly. For urgent queries, please call us directly.": "सेंट ज़ेवियर्स में संपर्क करने के लिए धन्यवाद। हमें आपकी पूछताछ प्राप्त हुई है और हम जल्द ही आपसे संपर्क करेंगे। तत्काल प्रश्नों के लिए कृपया सीधे फ़ोन करें।",

      // ═══ FOOTER ═══
      "Ready to give your child the Xavier's edge?": "अपने बच्चे को ज़ेवियर्स का लाभ देने के लिए तैयार हैं?",
      "Admissions open for Nursery — Class 12. Limited seats — apply early to avoid disappointment.": "नर्सरी से कक्षा 12 तक प्रवेश खुले हैं। सीमित सीटें — निराशा से बचने के लिए जल्दी आवेदन करें।",
      "All rights reserved.": "सर्वाधिकार सुरक्षित।",
      "Crafted with": "निर्मित",
      "for the St. Xavier's community": "सेंट ज़ेवियर्स समुदाय के लिए",
      "Built by Amrit Web Solutions": "Amrit Web Solutions द्वारा निर्मित",

      // ═══ NOTICE TICKER ═══
      "Dismiss notice": "सूचना बंद करें",
      "Notice": "सूचना",

      // ═══ FEATURES ═══
      "Why Families Choose St. Xavier's": "परिवार सेंट ज़ेवियर्स क्यों चुनते हैं",
      "A dedicated swimming pool — among the very few school pools in Muzaffarpur — coached by certified trainers.": "मुजफ्फरपुर के कुछ विद्यालय पूल में से एक — प्रमाणित प्रशिक्षकों द्वारा प्रशिक्षित।",
      "Well-Equipped Labs": "सुसज्जित प्रयोगशालाएं",
      "Modern Physics, Chemistry, Biology, Computer & Language labs providing hands-on scientific curiosity.": "आधुनिक भौतिकी, रसायन, जीव विज्ञान, कंप्यूटर और भाषा प्रयोगशालाएं।",
      "Auditorium": "सभागार",
      "A full-fledged auditorium hosting annual day, seminars, youth parliament and cultural performances.": "वार्षिकोत्सव, सेमिनार, युवा संसद और सांस्कृतिक प्रस्तुतियों के लिए पूर्ण सभागार।",
      "Music & Dance Rooms": "संगीत और नृत्य कक्ष",
      "Dedicated music rooms and dance rooms nurturing both classical and contemporary performing arts.": "शास्त्रीय और आधुनिक कला के लिए समर्पित संगीत और नृत्य कक्ष।",
      "Library": "पुस्तकालय",
      "IT Infrastructure": "आईटी ढांचा",
      "Smart classrooms and modern IT infrastructure with high-speed connectivity across the campus.": "स्मार्ट कक्षाएं और उच्च-गति कनेक्टिविटी के साथ आधुनिक आईटी ढांचा।",
      "Security & CCTV": "सुरक्षा और सीसीटीवी",
      "Round-the-clock CCTV surveillance and trained security personnel for complete peace of mind.": "24x7 सीसीटीवी निगरानी और प्रशिक्षित सुरक्षा कर्मी।",
      "Medical Facility": "चिकित्सा सुविधा",
      "On-campus medical facility with regular health and medical check-ups for every student.": "परिसर में चिकित्सा सुविधा और नियमित स्वास्थ्य जांच।",
      "Safe, punctual school transport fleet covering Muzaffarpur town and nearby areas.": "मुजफ्फरपुर शहर और आसपास के क्षेत्रों के लिए सुरक्षित, समयबद्ध परिवहन।",
      "Kindergarten Wing": "किंडरगार्टन विंग",
      "A dedicated, colourful kindergarten block designed for our youngest learners at Nursery–UKG.": "सबसे छोटे शिक्षार्थियों के लिए समर्पित रंगीन किंडरगार्टन ब्लॉक।",
      "Cultural Exchange": "सांस्कृतिक आदान-प्रदान",
      "Cultural exchange programmes connecting students with peers across the school chain.": "विद्यार्थियों को साथियों से जोड़ने वाले सांस्कृतिक आदान-प्रदान कार्यक्रम।",
      "Symposium & Seminars": "संगोष्ठी और सेमिनार",
      "Regular seminars, science exhibitions, youth parliament and workshops beyond the textbook.": "पाठ्यपुस्तक से परे नियमित सेमिनार, विज्ञान प्रदर्शनी, युवा संसद और कार्यशालाएं।",
      "Swimming Pool": "Swimming Pool",
      "Sports Academy": "Sports Academy",

      // ═══ BUTTONS / MISC ═══
      "Failed to load fee structure. Please try again later.": "शुल्क संरचना लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",
    };

    // Walk all text nodes and translate
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'input' || tag === 'textarea') return NodeFilter.FILTER_REJECT;
          if (parent.dataset.noTranslate !== undefined) return NodeFilter.FILTER_REJECT;
          if (node.textContent && node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) nodes.push(node as Text);

    nodes.forEach(textNode => {
      const original = textNode.textContent;
      if (!original) return;
      const trimmed = original.trim();
      if (!trimmed) return;

      // Direct full match
      if (replacements[trimmed]) {
        textNode.textContent = replacements[trimmed];
        return;
      }

      // Partial replacement — for text that contains translatable phrases
      let result = original;
      for (const [en, hi] of Object.entries(replacements)) {
        if (result.includes(en) && en.length > 3) {
          result = result.split(en).join(hi);
        }
      }
      if (result !== original) {
        textNode.textContent = result;
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll<HTMLInputElement>('[placeholder]').forEach(el => {
      const replacements: Record<string, string> = {
        "Your Name": "आपका नाम",
        "you@example.com": "आप@उदाहरण.com",
        "+91 90000 00000": "+91 90000 00000",
        "Grade Interested In": "रुचि वाली कक्षा",
        "Your Message": "आपका संदेश",
      };
      const original = el.placeholder;
      if (original && replacements[original]) el.placeholder = replacements[original];
    });

    document.body.dataset.hiActive = 'true';
  }, [lang, ready]);

  // When switching back to English, reload
  useEffect(() => {
    if (lang === 'en' && ready) {
      if (document.body.dataset.hiActive === 'true') {
        document.body.dataset.hiActive = 'false';
        window.location.reload();
      }
    }
  }, [lang, ready]);

  return <>{children}</>;
}
