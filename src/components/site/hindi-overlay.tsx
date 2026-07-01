'use client';

import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/components/site/language-provider";

/**
 * HindiOverlay — applies Hindi translations to the entire DOM via text-node walking.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHITECTURE (v2 — rewritten to fix cascading corruption & missed translations)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. **Original-text tracking**: every translated element stores its original
 *    English text in `data-en-original`. On every re-translation pass, the
 *    engine reads from the original — never from a partially-translated state.
 *    This eliminates the cascading-corruption bug where short dictionary keys
 *    ("To", "We", "IT", "No", "Day", "Free") would re-match inside Devanagari
 *    text and corrupt it.
 *
 * 2. **Case-insensitive matching**: ALL-CAPS badges like "WHY FAMILIES CHOOSE
 *    ST. XAVIER'S" now match title-case dictionary keys.
 *
 * 3. **Unicode-aware word boundaries**: uses `\p{L}` and `\p{N}` instead of
 *    `\w` so word boundaries work correctly at Latin/Devanagari junctions.
 *
 * 4. **No reload on switch back to English**: restores from `data-en-original`
 *    attribute, no `window.location.reload()` needed.
 *
 * 5. **MutationObserver** catches React re-renders and dynamic content (FAQ,
 *    Fees, Timetable, Notices fetched from API).
 *
 * 6. Translates placeholder, aria-label, title, alt attributes too.
 *
 * 7. Elements marked `data-no-translate` are skipped entirely.
 */

// ═══════════════════════════════════════════════════════════════
// TRANSLATION DICTIONARY
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS: Record<string, string> = {
  // ─── NAV ───
  "Home": "होम",
  "About": "हमारे बारे में",
  "About Us": "हमारे बारे में",
  "Academics": "शैक्षणिक",
  "Campus": "परिसर",
  "Campus & Facilities": "परिसर और सुविधाएँ",
  "Facilities": "सुविधाएँ",
  "Gallery": "गैलरी",
  "Timetable": "समय सारिणी",
  "Fees": "शुल्क",
  "Admissions": "प्रवेश",
  "Contact": "संपर्क",
  "Quick Links": "त्वरित लिंक",
  "Explore": "एक्सप्लोर",
  "Reach Us": "संपर्क करें",
  "Follow Us": "हमें फ़ॉलो करें",
  "Staff": "कर्मचारी",
  "Apply Now": "अभी आवेदन करें",
  "Apply for Admission": "प्रवेश हेतु आवेदन करें",
  "Admin Login": "व्यवस्थापक लॉगइन",
  "Photo Gallery": "फ़ोटो गैलरी",
  "Leadership": "नेतृत्व",
  "More": "और",
  "Est.": "स्थापित",
  "EST.": "स्थापित",
  "Est": "स्थापित",

  // ─── HERO ───
  "St.": "सेंट",
  "St. Xavier": "सेंट ज़ेवियर",
  "St. Xavier's": "सेंट ज़ेवियर्स",
  "Xavier": "ज़ेवियर",
  "Xavier's": "ज़ेवियर्स",
  "Xavierite": "ज़ेवियराइट",
  "Xavierites": "ज़ेवियराइट्स",
  "St. Xavier's Jr./Sr. School": "सेंट ज़ेवियर्स जूनियर/सीनियर विद्यालय",
  "Jr./Sr. School": "जूनियर/सीनियर विद्यालय",
  "Jr./Sr. School • Muzaffarpur": "जूनियर/सीनियर विद्यालय • मुजफ्फरपुर",
  "Jr./Sr. School, Muzaffarpur": "जूनियर/सीनियर विद्यालय, मुजफ्फरपुर",
  "St. Xavier's family": "ज़ेवियर्स परिवार",
  "Xavier's family": "ज़ेवियर्स परिवार",
  "the Xavier's edge": "ज़ेवियर्स का लाभ",
  "Xavier's difference": "ज़ेवियर्स का अंतर",
  "the Xavier's": "ज़ेवियर्स",
  "Where Discipline Meets Opportunity": "जहाँ अनुशासन मिलता है अवसर से",
  "Where Discipline Meets Opportunity.": "जहाँ अनुशासन मिलता है अवसर से।",
  "Nurturing curious minds since": "से जिज्ञासु मनों का पोषण",
  "Nurturing curious minds": "जिज्ञासु मनों का पोषण",
  "Nurturing": "पोषण",
  "curious minds": "जिज्ञासु मनों",
  "Begin Your Journey": "अपनी यात्रा शुरू करें",
  "Explore Campus": "परिसर देखें",
  "Scroll": "स्क्रॉल",
  "Students": "विद्यार्थी",
  "CBSE • Est.": "सीबीएसई • स्थापित",
  "CBSE • Est. 1976": "सीबीएसई • स्थापित 1976",
  "CBSE Affiliated • Est. 1976": "सीबीएसई संबद्ध • स्थापित 1976",
  "CBSE Affiliated": "सीबीएसई संबद्ध",
  "#1 Ranked School in Muzaffarpur": "मुजफ्फरपुर का नंबर 1 रैंक विद्यालय",
  "#1 Ranked School": "नंबर 1 रैंक विद्यालय",
  "Ranked School": "रैंक विद्यालय",
  "Nursery to Std. XII": "नर्सरी से मानक 12",
  "Nursery → Class 12": "नर्सरी → कक्षा 12",
  "Nursery to Class 12": "नर्सरी से कक्षा 12",
  "Nursery — Class 12": "नर्सरी — कक्षा 12",
  "Day School": "दिवस विद्यालय",
  "Co-Educational": "सह-शैक्षिक",
  "Co-Educational English Medium": "सह-शैक्षिक अंग्रेज़ी माध्यम",
  "English Medium": "अंग्रेज़ी माध्यम",
  "Est. 1976": "स्थापित 1976",
  "Established 1976": "स्थापित 1976",
  "Established": "स्थापित",
  "Founded in 1976": "1976 में स्थापित",
  "Founded in": "स्थापित",
  "since 1976": "1976 से",
  "Five Decades of Legacy": "पाँच दशकों की विरासत",
  "Nearly Five Decades of Legacy": "लगभग पाँच दशकों की विरासत",
  "Nearly five decades of legacy": "लगभग पाँच दशकों की विरासत",
  "ESTABLISHED 1976 • NEARLY FIVE DECADES OF LEGACY": "स्थापित 1976 • लगभग पाँच दशकों की विरासत",
  "Years of Trust": "विश्वास के वर्ष",
  "Decades of Excellence": "उत्कृष्टता के दशक",

  // ─── GENERIC UI ───
  "All": "सभी",
  "All Categories": "सभी श्रेणियाँ",
  "Open": "खुला",
  "Closed": "बंद",
  "Today": "आज",
  "Now": "अभी",
  "New": "नया",
  "Featured": "विशेष",
  "Popular": "लोकप्रिय",
  "Latest": "नवीनतम",
  "View All": "सभी देखें",
  "Learn More": "और जानें",
  "Read More": "और पढ़ें",
  "Get Started": "शुरू करें",
  "Get Directions": "दिशा-निर्देश पाएं",
  "Call Now": "अभी कॉल करें",
  "Call school": "विद्यालय को कॉल करें",
  "Email Us": "हमें ईमेल करें",
  "Follow": "फ़ॉलो करें",
  "Follow us": "हमें फ़ॉलो करें",
  "Share": "साझा करें",
  "Print": "प्रिंट करें",
  "Download": "डाउनलोड करें",
  "View": "देखें",
  "Listen": "सुनें",
  "Watch": "देखें",
  "Play": "चलाएं",
  "Pause": "रोकें",
  "Stop": "बंद करें",
  "Search": "खोजें",
  "Filter": "फ़िल्टर",
  "Sort": "क्रमबद्ध करें",
  "Settings": "सेटिंग्स",
  "Profile": "प्रोफ़ाइल",
  "Account": "खाता",
  "Dashboard": "डैशबोर्ड",
  "Welcome": "स्वागत है",
  "Thank You": "धन्यवाद",
  "Thank you": "धन्यवाद",
  "Success": "सफलता",
  "Warning": "चेतावनी",
  "Info": "जानकारी",
  "Help": "सहायता",
  "Support": "सहायता",
  "Feedback": "प्रतिक्रिया",
  "Report": "रिपोर्ट",
  "Subscribe": "सदस्यता लें",
  "Subscribe to our newsletter": "हमारे न्यूज़लेटर की सदस्यता लें",
  "Stay updated": "अपडेट रहें",
  "Latest News": "ताज़ा समाचार",
  "Upcoming Events": "आगामी कार्यक्रम",
  "Recent Updates": "हाल के अपडेट",
  "(optional)": "(वैकल्पिक)",
  "Network": "नेटवर्क",
  "Tap to retry": "पुनः प्रयास करने के लिए टैप करें",
  "Couldn't load FAQs.": "प्रश्न लोड नहीं हो सके।",
  "Couldn't load the fee structure.": "शुल्क संरचना लोड नहीं हो सकी।",
  "Couldn't load the timetable.": "समय सारिणी लोड नहीं हो सकी।",
  "Skip to content": "सामग्री पर जाएं",
  "Switch language": "भाषा बदलें",

  // ─── ABOUT ───
  "Our Mission": "हमारा मिशन",
  "Our Vision": "हमारा विज़न",
  "Our Values": "हमारे मूल्य",
  "Managing Society": "प्रबंध समिति",
  "Campus Area": "परिसर क्षेत्र",
  "Students Enrolled": "विद्यार्थी नामांकन",
  "Library Books": "पुस्तकालय पुस्तकें",
  "Skilled Teachers": "कुशल शिक्षक",
  "Year of Establishment": "स्थापना वर्ष",
  "Across Nursery to Class XII": "नर्सरी से कक्षा 12 तक",
  "Dedicated & experienced faculty": "समर्पित और अनुभवी संकाय",
  "Reading culture since 1976": "1976 से पठन संस्कृति",
  "Chandra Children Welfare Society": "चंद्र चिल्ड्रन वेलफेयर सोसाइटी",
  "registered under the Societies Reg. Act. XXI 1860": "सोसाइटीज़ पंजीकरण अधिनियम 21, 1860 के तहत पंजीकृत",
  "8,094 Sq. Metres (2+ acres)": "8,094 वर्ग मीटर (2+ एकड़)",
  "2+ acres": "2+ एकड़",
  "8,094 Sq. Metres": "8,094 वर्ग मीटर",
  "Sq. Metres": "वर्ग मीटर",
  "acres": "एकड़",
  "A legacy of": "की विरासत",
  "excellence": "उत्कृष्टता",
  "Goshala Road": "गोशाला रोड",
  "on Goshala Road": "गोशाला रोड पर",
  "A legacy of excellence on": "की उत्कृष्टता की विरासत",
  "and administered by the": "द्वारा प्रशासित",
  "under the chairmanship of": "की अध्यक्षता में",
  "is a Co-Educational English Medium School affiliated to CBSE, New Delhi, up to 10+2 level.": "एक सह-शैक्षिक अंग्रेज़ी माध्यम विद्यालय है जो सीबीएसई, नई दिल्ली से 10+2 स्तर तक संबद्ध है।",
  "Located on": "स्थित",
  "in a healthy and peaceful locality of Muzaffarpur, the campus spans over two acres of protected, pollution-free land with abundant green surroundings — a congenial setting for serious learning.": "में, मुजफ्फरपुर के एक स्वस्थ और शांतिपूर्ण इलाके में, परिसर प्रदूषण-मुक्त संरक्षित भूमि के दो एकड़ में फैला है जहाँ हरियाली भरपूर है — गंभीर अध्ययन के लिए एक अनुकूल वातावरण।",

  // ─── PRINCIPAL MESSAGE (full paragraph) ───
  "Education is important for one's success in life. It is essential for an individual's growth. The process of learning and improving one's skills is referred to as education. Wisdom and the ability to handle challenges come with knowledge. Education enhances one's quality of life while also granting social recognition.": "शिक्षा जीवन में सफलता के लिए महत्वपूर्ण है। यह व्यक्ति के विकास के लिए आवश्यक है। सीखने और अपने कौशल को निखारने की प्रक्रिया को शिक्षा कहा जाता है। ज्ञान के साथ बुद्धिमत्ता और चुनौतियों से निपटने की क्षमता आती है। शिक्षा जीवन की गुणवत्ता बढ़ाती है और सामाजिक मान्यता भी प्रदान करती है।",

  // ─── PILLARS (about) ───
  "To form young men and women of competence, conscience and compassion — intellectually sharp, morally grounded and socially responsible — ready to lead and serve.": "योग्यता, विवेक और करुणा से युक्त युवा पुरुषों और महिलाओं का निर्माण करना — बौद्धिक रूप से तेज़, नैतिक रूप से दृढ़ और सामाजिक रूप से ज़िम्मेदार — नेतृत्व और सेवा के लिए तैयार।",
  "To be the most loved and trusted centre of school education in Muzaffarpur — a place where every child is seen, heard and challenged to become the best version of themselves.": "मुजफ्फरपुर में स्कूल शिक्षा का सबसे प्रिय और विश्वसनीय केंद्र बनना — ऐसी जगह जहाँ हर बच्चे को देखा, सुना और उसे सर्वश्रेष्ठ बनने के लिए चुनौती दी जाती है।",
  "Discipline, dignity and devotion. We pair rigorous academics with character formation, so our students leave with both a degree and a moral compass.": "अनुशासन, गरिमा और समर्पण। हम कठोर शैक्षणिक शिक्षा को चरित्र निर्माण के साथ जोड़ते हैं, ताकि हमारे विद्यार्थी डिग्री और नैतिक दिशा-निर्देश दोनों के साथ निकलें।",

  // ─── FEATURES ───
  "WHY FAMILIES CHOOSE ST. XAVIER'S": "परिवार सेंट ज़ेवियर्स क्यों चुनते हैं",
  "Why families choose St. Xavier's": "परिवार सेंट ज़ेवियर्स क्यों चुनते हैं",
  "World-class facilities,": "विश्व-स्तरीय सुविधाएँ,",
  "for every student": "हर विद्यार्थी के लिए",
  "World-class facilities, for every student.": "विश्व-स्तरीय सुविधाएँ, हर विद्यार्थी के लिए।",
  "World-class facilities": "विश्व-स्तरीय सुविधाएँ",

  // Features list
  "Swimming Pool": "स्विमिंग पूल",
  "A dedicated swimming pool — among the very few school pools in Muzaffarpur — coached by certified trainers.": "एक समर्पित स्विमिंग पूल — मुजफ्फरपुर के बहुत कम स्कूल पूल्स में से एक — प्रमाणित प्रशिक्षकों द्वारा प्रशिक्षित।",
  "Well-Equipped Labs": "सुसज्जित प्रयोगशालाएँ",
  "Modern Physics, Chemistry, Biology, Computer & Language labs providing hands-on scientific curiosity.": "आधुनिक भौतिकी, रसायन, जीव विज्ञान, कंप्यूटर और भाषा प्रयोगशालाएँ जो व्यावहारिक वैज्ञानिक जिज्ञासा प्रदान करती हैं।",
  "Sports Academy": "खेल अकादमी",
  "Structured sports academy with basketball, indoor games, yoga, aerobics and annual sports day events.": "बास्केटबॉल, इंडोर गेम्स, योगा, एरोबिक्स और वार्षिक खेल दिवस कार्यक्रमों के साथ संरचित खेल अकादमी।",
  "Auditorium": "सभागार",
  "A full-fledged auditorium hosting annual day, seminars, youth parliament and cultural performances.": "एक पूर्ण सभागार जो वार्षिकोत्सव, सेमिनार, युवा संसद और सांस्कृतिक प्रस्तुतियों का आयोजन करता है।",
  "Music & Dance Rooms": "संगीत और नृत्य कक्ष",
  "Dedicated music rooms and dance rooms nurturing both classical and contemporary performing arts.": "समर्पित संगीत कक्ष और नृत्य कक्ष जो शास्त्रीय और आधुनिक प्रदर्शन कलाओं का पोषण करते हैं।",
  "Library": "पुस्तकालय",
  "Over": "ऊपर",
  "books": "पुस्तकें",
  "journals": "पत्रिकाएँ",
  "reference material": "संदर्भ सामग्री",
  "fostering": "को बढ़ावा देना",
  "lifelong": "आजीवन",
  "reading culture": "पठन संस्कृति",
  "a lifelong reading culture": "आजीवन पठन संस्कृति",
  "fostering a lifelong reading culture": "आजीवन पठन संस्कृति को बढ़ावा देना",
  "books, journals and reference material fostering a lifelong reading culture": "पुस्तकें, पत्रिकाएँ और संदर्भ सामग्री आजीवन पठन संस्कृति को बढ़ावा देना",
  "books, journals": "पुस्तकें, पत्रिकाएँ",
  "IT Infrastructure": "आईटी आधारभूत संरचना",
  "Smart classrooms and modern IT infrastructure with high-speed connectivity across the campus.": "स्मार्ट कक्षाएँ और आधुनिक आईटी आधारभूत संरचना जो परिसर भर में उच्च-गति कनेक्टिविटी प्रदान करती है।",
  "Security & CCTV": "सुरक्षा और सीसीटीवी",
  "Round-the-clock CCTV surveillance and trained security personnel for complete peace of mind.": "संपूर्ण मन की शांति के लिए 24 घंटे सीसीटीवी निगरानी और प्रशिक्षित सुरक्षा कर्मी।",
  "Medical Facility": "चिकित्सा सुविधा",
  "On-campus medical facility with regular health and medical check-ups for every student.": "हर विद्यार्थी के लिए नियमित स्वास्थ्य और चिकित्सा जाँच के साथ परिसर में चिकित्सा सुविधा।",
  "Transport": "परिवहन",
  "Safe, punctual school transport fleet covering Muzaffarpur town and nearby areas.": "मुजफ्फरपुर शहर और आसपास के क्षेत्रों को कवर करने वाला सुरक्षित, समयनिष्ठ विद्यालय परिवहन बेड़ा।",
  "Kindergarten Wing": "किंडरगार्टन विंग",
  "A dedicated, colourful kindergarten block designed for our youngest learners at Nursery–UKG.": "नर्सरी-यूकेजी के सबसे छोटे शिक्षार्थियों के लिए डिज़ाइन किया गया एक समर्पित, रंगीन किंडरगार्टन ब्लॉक।",
  "Cultural Exchange": "सांस्कृतिक आदान-प्रदान",
  "Cultural exchange programmes connecting students with peers across the school chain.": "सांस्कृतिक आदान-प्रदान कार्यक्रम जो विद्यार्थियों को विद्यालय श्रृंखला भर में सहपाठियों से जोड़ते हैं।",
  "Symposium & Seminars": "संगोष्ठि और सेमिनार",
  "Regular seminars, science exhibitions, youth parliament and workshops beyond the textbook.": "पाठ्यपुस्तक से परे नियमित सेमिनार, विज्ञान प्रदर्शनी, युवा संसद और कार्यशालाएँ।",
  "Smart Classes": "स्मार्ट कक्षाएँ",
  "Holistic Development": "सर्वांगीण विकास",
  "Expert Faculty": "विशेषज्ञ संकाय",
  "Modern Labs": "आधुनिक प्रयोगशालाएँ",
  "Cultural Excellence": "सांस्कृतिक उत्कृष्टता",

  // ─── ACADEMICS ───
  "ACADEMIC JOURNEY": "शैक्षणिक यात्रा",
  "Academic Journey": "शैक्षणिक यात्रा",
  "From first steps to": "पहले कदम से",
  "graduation walk": "स्नातक समारोह तक",
  "From first steps to graduation walk.": "पहले कदम से स्नातक समारोह तक।",
  "Pre-Primary": "पूर्व-प्राथमिक",
  "Primary": "प्राथमिक",
  "Middle School": "मध्य विद्यालय",
  "Secondary": "माध्यमिक",
  "Senior Secondary": "वरिष्ठ माध्यमिक",
  "Nursery — UKG": "नर्सरी — यूकेजी",
  "Class 1 — 5": "कक्षा 1 — 5",
  "Class 6 — 8": "कक्षा 6 — 8",
  "Class 9 — 10": "कक्षा 9 — 10",
  "Class 11 — 12": "कक्षा 11 — 12",
  "Age 3–5": "आयु 3–5",
  "Age 6–10": "आयु 6–10",
  "Age 11–13": "आयु 11–13",
  "Age 14–15": "आयु 14–15",
  "Age 16–17": "आयु 16–17",
  "A play-based foundation where curiosity is kindled through stories, songs, art and gentle structure. Focus on motor skills, phonics, socialisation and the joy of learning, in our dedicated colourful Kindergarten wing.": "खेल-आधारित नींव जहाँ कहानियों, गीतों, कला और कोमल संरचना के माध्यम से जिज्ञासा जगाई जाती है। हमारे समर्पित रंगीन किंडरगार्टन विंग में मोटर कौशल, ध्वन्यात्मकता, समाजीकरण और सीखने के आनंद पर ध्यान केंद्रित किया जाता है।",
  "Dedicated Kindergarten block": "समर्पित किंडरगार्टन ब्लॉक",
  "Phonics & number readiness": "ध्वन्यात्मकता और संख्या तत्परता",
  "Activity-based learning": "गतिविधि-आधारित शिक्षण",
  "Trained early-childhood educators": "प्रशिक्षित पूर्व-बाल्यावस्था शिक्षक",
  "Strong literacy, numeracy and inquiry skills are built through experiential learning. Children begin exploring science, social studies, computers and a third language, supported by our 6,500+ book library.": "अनुभवात्मक शिक्षण के माध्यम से मज़बूत साक्षरता, संख्याज्ञान और अन्वेषण कौशल का निर्माण किया जाता है। बच्चे विज्ञान, सामाजिक अध्ययन, कंप्यूटर और तीसरी भाषा की खोज शुरू करते हैं, हमारी 6,500+ पुस्तकों की पुस्तकालय द्वारा समर्थित।",
  "Reading & writing fluency programmes": "पठन और लेखन प्रवाह कार्यक्रम",
  "Hands-on EVS projects": "व्यावहारिक पर्यावरण अध्ययन परियोजनाएँ",
  "Computer education from Class 1": "कक्षा 1 से कंप्यूटर शिक्षा",
  "Annual sport & cultural houses": "वार्षिक खेल और सांस्कृतिक गृह",
  "Conceptual depth increases across all CBSE subjects. Students rotate through our Physics, Chemistry, Biology and Computer labs, take up science exhibitions and begin structured career-awareness conversations.": "सभी सीबीएसई विषयों में वैचारिक गहराई बढ़ती है। विद्यार्थी हमारी भौतिकी, रसायन, जीव विज्ञान और कंप्यूटर प्रयोगशालाओं में घूमते हैं, विज्ञान प्रदर्शनियों में भाग लेते हैं और संरचित करियर-जागरूकता वार्तालाप शुरू करते हैं।",
  "Subject-specialist faculty": "विषय-विशेषज्ञ संकाय",
  "Well-equipped science labs": "सुसज्जित विज्ञान प्रयोगशालाएँ",
  "Mandatory library hours": "अनिवार्य पुस्तकालय घंटे",
  "Science exhibition & seminars": "विज्ञान प्रदर्शनी और सेमिनार",
  "Focused CBSE Board preparation (AISSE) with rigorous assessments, doubt-clearing cells and personalised mentoring. Every student is paired with a teacher-mentor for the year.": "कठोर मूल्यांकन, संदेह-समाधान कक्षों और व्यक्तिगत मार्गदर्शन के साथ केंद्रित सीबीएसई बोर्ड तैयारी (एआईएसएसई)। हर विद्यार्थी को वर्ष के लिए एक शिक्षक-मार्गदर्शक के साथ जोड़ा जाता है।",
  "Board-exam strategy workshops": "बोर्ड परीक्षा रणनीति कार्यशालाएँ",
  "Regular tests & analysis": "नियमित परीक्षण और विश्लेषण",
  "Mentor-mentee pairing": "मार्गदर्शक-शिष्य युगलन",
  "Life-skills & value education": "जीवन-कौशल और मूल्य शिक्षा",
  "Four streams — PCM, PCB, Commerce and Arts — affiliated to CBSE up to 10+2. Recent AISSCE 2026 topper Krishna Saraf scored 97.2%, with 100% result for the batch.": "चार धाराएँ — पीसीएम, पीसीबी, वाणिज्य और कला — सीबीएसई से 10+2 तक संबद्ध। हाल के एएआईएसएससीई 2026 टॉपर कृष्णा सराफ ने 97.2% अंक प्राप्त किए, बैच के लिए 100% परिणाम के साथ।",
  "PCM • PCB • Commerce • Arts": "पीसीएम • पीसीबी • वाणिज्य • कला",
  "Youth parliament & workshops": "युवा संसद और कार्यशालाएँ",
  "Dedicated senior study lounges": "समर्पित वरिष्ठ अध्ययन लाउंज",
  "Programme Highlights": "कार्यक्रम विशेषताएँ",
  "Senior Secondary Streams": "वरिष्ठ माध्यमिक धाराएँ",
  "Four pathways. One promise — your child is ready for what comes next.": "चार रास्ते। एक वादा — आपका बच्चा आगे आने वाली हर चीज़ के लिए तैयार है।",
  "Four pathways. One promise —": "चार रास्ते। एक वादा —",
  "your child is ready for what comes next.": "आपका बच्चा आगे आने वाली हर चीज़ के लिए तैयार है।",
  "AISSCE 2026 Topper:": "एएआईएसएससीई 2026 टॉपर:",
  "100% Result": "100% परिणाम",
  "AISSCE 2026 Topper: Krishna Saraf — 97.2% • 100% Result": "एएआईएसएससीई 2026 टॉपर: कृष्णा सराफ — 97.2% • 100% परिणाम",

  // Streams
  "Physics • Chemistry • Mathematics • Optional CS": "भौतिकी • रसायन • गणित • वैकल्पिक सीएस",
  "Physics • Chemistry • Biology • Optional Maths": "भौतिकी • रसायन • जीव विज्ञान • वैकल्पिक गणित",
  "Accountancy • Business Studies • Economics • Maths": "लेखाशास्त्र • व्यवसाय अध्ययन • अर्थशास्त्र • गणित",
  "History • Political Science • Geography • Psychology": "इतिहास • राजनीति विज्ञान • भूगोल • मनोविज्ञान",
  "Science (PCM)": "विज्ञान (पीसीएम)",
  "Science (PCB)": "विज्ञान (पीसीबी)",
  "Commerce": "वाणिज्य",
  "Arts": "कला",

  // ─── ADMISSIONS ───
  "ADMISSIONS OPEN • SESSION 2026 – 27": "प्रवेश खुले हैं • सत्र 2026 – 27",
  "Admissions Open": "प्रवेश खुले हैं",
  "Four steps to": "चार चरण",
  "admission": "प्रवेश",
  "Four steps to admission.": "प्रवेश के चार चरण।",
  "A simple, transparent admission process for": "के लिए एक सरल, पारदर्शी प्रवेश प्रक्रिया",
  "Reach out at any stage — our admissions team is happy to walk you through it.": "किसी भी चरण पर संपर्क करें — हमारी प्रवेश टीम आपको इसमें मार्गदर्शन करने में प्रसन्न है।",
  "Registration": "पंजीकरण",
  "Collect & submit the Registration Form from the school office along with the registration fee and required documents.": "विद्यालय कार्यालय से पंजीकरण फ़ॉर्म एकत्र करें और पंजीकरण शुल्क तथा आवश्यक दस्तावेज़ों के साथ जमा करें।",
  "~30 min at office": "कार्यालय में ~30 मिनट",
  "Interaction / Assessment": "संवाद / मूल्यांकन",
  "An age-appropriate interaction (Nursery–Class 1) or written assessment (Class 2 onwards) to understand the child's readiness.": "बच्चे की तत्परता को समझने के लिए आयु-उपयुक्त संवाद (नर्सरी–कक्षा 1) या लिखित मूल्यांकन (कक्षा 2 से आगे)।",
  "~1–2 hours": "~1–2 घंटे",
  "Offer & Confirmation": "प्रस्ताव और पुष्टि",
  "Selected candidates receive a provisional admission offer. Confirm the seat by paying the first instalment to lock it in.": "चयनित उम्मीदवारों को अस्थायी प्रवेश प्रस्ताव प्राप्त होता है। सीट को पक्का करने के लिए पहली किस्त का भुगतान करें।",
  "~30 min confirmation": "~30 मिनट पुष्टि",
  "Fee Payment & Joining": "शुल्क भुगतान और शामिल होना",
  "Complete fee formalities, submit original documents and collect uniform, books and the joining kit. Welcome to Xavier's!": "शुल्क औपचारिकताएँ पूरी करें, मूल दस्तावेज़ जमा करें और वर्दी, किताबें तथा शामिल होने का किट लें। ज़ेवियर्स में आपका स्वागत है!",
  "~1 hour for kit": "किट के लिए ~1 घंटा",
  "Documents to bring": "लाने योग्य दस्तावेज़",
  "Keep these ready to make registration a breeze.": "पंजीकरण को आसान बनाने के लिए इन्हें तैयार रखें।",
  "Birth certificate (photocopy & original)": "जन्म प्रमाणपत्र (फ़ोटोकॉपी और मूल)",
  "4 recent passport-size photographs": "4 हाल की पासपोर्ट-आकार तस्वीरें",
  "Aadhaar card of student & parents": "विद्यार्थी और अभिभावक का आधार कार्ड",
  "Previous school's Transfer Certificate (Class 2+)": "पिछले विद्यालय का स्थानांतरण प्रमाणपत्र (कक्षा 2+)",
  "Last report card / mark sheet": "अंतिम रिपोर्ट कार्ड / अंक-सूची",
  "Caste / income certificate (if applicable)": "जाति / आय प्रमाणपत्र (यदि लागू हो)",
  "Have a question about admissions or fees?": "प्रवेश या शुल्क के बारे में कोई प्रश्न है?",
  "Speak directly with our Admissions Office for the latest fee structure, important dates, and any queries. We're happy to help.": "नवीनतम शुल्क संरचना, महत्वपूर्ण तिथियों और किसी भी प्रश्न के लिए हमारे प्रवेश कार्यालय से सीधे बात करें। हम सहायता के लिए तैयार हैं।",
  "Send an Enquiry": "पूछताछ भेजें",
  "Send Another Enquiry": "एक और पूछताछ भेजें",
  "Send Enquiry": "पूछताछ भेजें",
  "Sending…": "भेजा जा रहा है…",
  "Enquiry Received!": "पूछताछ प्राप्त हुई!",
  "Thank you for reaching out to St. Xavier's. We've received your enquiry and will get back to you shortly. For urgent queries, please call us directly.": "सेंट ज़ेवियर्स तक पहुँचने के लिए धन्यवाद। हमें आपकी पूछताछ प्राप्त हुई है और हम शीघ्र ही आपसे संपर्क करेंगे। तत्काल प्रश्नों के लिए, कृपया हमें सीधे कॉल करें।",

  // ─── FEES ───
  "FEE STRUCTURE • ACADEMIC SESSION 2026–27": "शुल्क संरचना • शैक्षणिक सत्र 2026–27",
  "Fee Structure": "शुल्क संरचना",
  "Transparent": "पारदर्शी",
  "fee structure": "शुल्क संरचना",
  "Transparent fee structure.": "पारदर्शी शुल्क संरचना।",
  "All charges are listed below with no hidden costs. For class-specific variations, concessions, or sibling discounts, please contact the school office.": "सभी शुल्क नीचे कोई छिपी लागत के बिना सूचीबद्ध हैं। कक्षा-विशिष्ट भिन्नताओं, छूट, या सहोदर छूट के लिए, कृपया विद्यालय कार्यालय से संपर्क करें।",
  "Particulars": "विवरण",
  "Category": "श्रेणी",
  "Frequency": "आवृत्ति",
  "Amount": "राशि",
  "General": "सामान्य",
  "Laboratory": "प्रयोगशाला",
  "Examination": "परीक्षा",
  "One Time": "एकमुश्त",
  "Yearly": "वार्षिक",
  "Quarterly": "त्रैमासिक",
  "Monthly": "मासिक",
  "Free": "निःशुल्क",
  "Approx. Yearly Total": "अनुमानित वार्षिक कुल",
  "(excluding one-time fees)": "(एकमुश्त शुल्क को छोड़कर)",
  "Admission Fee": "प्रवेश शुल्क",
  "Payable at the time of admission": "प्रवेश के समय देय",
  "Security Deposit (Refundable)": "सुरक्षा जमा (वापसी योग्य)",
  "Refundable on withdrawal": "वापसी पर वापस योग्य",
  "Registration Fee": "पंजीकरण शुल्क",
  "Non-refundable": "अनवापसीय",
  "Tuition Fee (Nursery–UKG)": "शिक्षण शुल्क (नर्सरी–यूकेजी)",
  "Or 12 monthly installments of ₹2,000": "या ₹2,000 की 12 मासिक किस्तें",
  "Tuition Fee (Class 1–5)": "शिक्षण शुल्क (कक्षा 1–5)",
  "Or 12 monthly installments of ₹2,500": "या ₹2,500 की 12 मासिक किस्तें",
  "Tuition Fee (Class 6–8)": "शिक्षण शुल्क (कक्षा 6–8)",
  "Or 12 monthly installments of ₹3,000": "या ₹3,000 की 12 मासिक किस्तें",
  "Tuition Fee (Class 9–10)": "शिक्षण शुल्क (कक्षा 9–10)",
  "Or 12 monthly installments of ₹3,500": "या ₹3,500 की 12 मासिक किस्तें",
  "Tuition Fee (Class 11–12)": "शिक्षण शुल्क (कक्षा 11–12)",
  "PCM/PCB/Commerce/Arts": "पीसीएम/पीसीबी/वाणिज्य/कला",
  "Laboratory Fee (Class 9–12)": "प्रयोगशाला शुल्क (कक्षा 9–12)",
  "Physics, Chemistry, Biology, Computer": "भौतिकी, रसायन, जीव विज्ञान, कंप्यूटर",
  "Examination Fee": "परीक्षा शुल्क",
  "Includes all internal assessments": "सभी आंतरिक मूल्यांकन शामिल",
  "Smart Class Fee": "स्मार्ट कक्षा शुल्क",
  "Digital learning resources": "डिजिटल शिक्षण संसाधन",
  "Development Fee": "विकास शुल्क",
  "Infrastructure maintenance": "आधारभूत संरचना रखरखाव",
  "Transport Fee (Within 5 km)": "परिवहन शुल्क (5 किमी के भीतर)",
  "Optional": "वैकल्पिक",
  "Transport Fee (5–15 km)": "परिवहन शुल्क (5–15 किमी)",
  "Swimming Pool Access": "स्विमिंग पूल उपयोग",
  "Optional, coached by certified trainers": "वैकल्पिक, प्रमाणित प्रशिक्षकों द्वारा प्रशिक्षित",
  "Annual Day / Cultural Fund": "वार्षिकोत्सव / सांस्कृतिक कोष",
  "Costumes, props, events": "पोशाक, सामग्री, कार्यक्रम",
  "Have questions about fees or concessions?": "शुल्क या छूट के बारे में प्रश्न हैं?",
  "Our office can clarify class-wise variations, sibling discounts, and instalment options.": "हमारा कार्यालय कक्षा-वार भिन्नताओं, सहोदर छूट और किस्त विकल्पों को स्पष्ट कर सकता है।",
  "Enquire": "पूछताछ करें",
  "Fee details will be published shortly. Please contact the school office for the latest structure.": "शुल्क विवरण शीघ्र ही प्रकाशित किए जाएंगे। नवीनतम संरचना के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",

  // ─── FAQ ───
  "FREQUENTLY ASKED QUESTIONS": "अक्सर पूछे जाने वाले प्रश्न",
  "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
  "Got questions?": "प्रश्न हैं?",
  "We've got answers.": "हमारे पास उत्तर हैं।",
  "Got questions? We've got answers.": "प्रश्न हैं? हमारे पास उत्तर हैं।",
  "Everything parents ask us — about admissions, facilities, academics and life at Xavier's.": "परिवार हमसे जो पूछते हैं — प्रवेश, सुविधाओं, शैक्षणिक और ज़ेवियर्स में जीवन के बारे में।",
  "Still have a question?": "अभी भी प्रश्न है?",
  "Our office is happy to help with anything not covered above.": "हमारा कार्यालय ऊपर शामिल नहीं किसी भी चीज़ में सहायता के लिए प्रसन्न है।",
  "Contact Us": "संपर्क करें",
  "No FAQs available right now. Please contact the school office for any questions.": "अभी कोई प्रश्न उपलब्ध नहीं हैं। किसी भी प्रश्न के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",

  // FAQ seed data (questions)
  "What is the age criteria for admission to Nursery?": "नर्सरी में प्रवेश के लिए आयु मानदंड क्या है?",
  "A child must be 3+ years old as on 31st March of the academic year for Nursery admission. For UKG, the child should be 5+ years old.": "शैक्षणिक वर्ष के 31 मार्च तक बच्चा नर्सरी प्रवेश के लिए 3+ वर्ष का होना चाहिए। यूकेजी के लिए बच्चा 5+ वर्ष का होना चाहिए।",
  "Is the school affiliated to CBSE?": "क्या विद्यालय सीबीएसई से संबद्ध है?",
  "Yes, St. Xavier's Jr./Sr. School is affiliated to the Central Board of Secondary Education (CBSE), New Delhi, up to 10+2 level. The school has been affiliated since its establishment in 1976.": "हाँ, सेंट ज़ेवियर्स जूनियर/सीनियर विद्यालय केंद्रीय माध्यमिक शिक्षा बोर्ड (सीबीएसई), नई दिल्ली से 10+2 स्तर तक संबद्ध है। विद्यालय 1976 में स्थापना से ही संबद्ध है।",
  "What documents are required for admission?": "प्रवेश के लिए कौन से दस्तावेज़ आवश्यक हैं?",
  "The following documents are required: (1) Birth certificate (photocopy & original), (2) 4 recent passport-size photographs, (3) Aadhaar card of student & parents, (4) Previous school's Transfer Certificate (for Class 2 onwards), (5) Last report card / mark sheet, (6) Caste / income certificate (if applicable).": "निम्नलिखित दस्तावेज़ आवश्यक हैं: (1) जन्म प्रमाणपत्र (फ़ोटोकॉपी और मूल), (2) 4 हाल की पासपोर्ट-आकार तस्वीरें, (3) विद्यार्थी और अभिभावक का आधार कार्ड, (4) पिछले विद्यालय का स्थानांतरण प्रमाणपत्र (कक्षा 2 से आगे के लिए), (5) अंतिम रिपोर्ट कार्ड / अंक-सूची, (6) जाति / आय प्रमाणपत्र (यदि लागू हो)।",
  "What streams are offered in Class 11 and 12?": "कक्षा 11 और 12 में कौन सी धाराएँ प्रदान की जाती हैं?",
  "We offer four streams: PCM (Physics, Chemistry, Mathematics), PCB (Physics, Chemistry, Biology), Commerce (Accountancy, Business Studies, Economics), and Arts (History, Political Science, Geography, Psychology). All streams are affiliated to CBSE.": "हम चार धाराएँ प्रदान करते हैं: पीसीएम (भौतिकी, रसायन, गणित), पीसीबी (भौतिकी, रसायन, जीव विज्ञान), वाणिज्य (लेखाशास्त्र, व्यवसाय अध्ययन, अर्थशास्त्र), और कला (इतिहास, राजनीति विज्ञान, भूगोल, मनोविज्ञान)। सभी धाराएँ सीबीएसई से संबद्ध हैं।",
  "Does the school provide transport facility?": "क्या विद्यालय परिवहन सुविधा प्रदान करता है?",
  "Yes, we provide safe and punctual school transport covering Muzaffarpur town and nearby areas. The transport fee varies based on distance (₹1,200/month within 5 km, ₹1,800/month for 5–15 km). All buses have GPS tracking and trained attendants.": "हाँ, हम मुजफ्फरपुर शहर और आसपास के क्षेत्रों को कवर करने वाला सुरक्षित और समयनिष्ठ विद्यालय परिवहन प्रदान करते हैं। परिवहन शुल्क दूरी के आधार पर भिन्न होता है (5 किमी के भीतर ₹1,200/माह, 5–15 किमी के लिए ₹1,800/माह)। सभी बसों में जीपीएस ट्रैकिंग और प्रशिक्षित परिचारक हैं।",
  "What is the student-teacher ratio?": "विद्यार्थी-शिक्षक अनुपात क्या है?",
  "We maintain a healthy student-teacher ratio of approximately 17:1 (1,222 students and 71 skilled teachers). This ensures personalized attention for every child.": "हम लगभग 17:1 (1,222 विद्यार्थी और 71 कुशल शिक्षक) का स्वस्थ विद्यार्थी-शिक्षक अनुपात बनाए रखते हैं। यह हर बच्चे के लिए व्यक्तिगत ध्यान सुनिश्चित करता है।",
  "Does the school have a swimming pool?": "क्या विद्यालय में स्विमिंग पूल है?",
  "Yes! We have a dedicated swimming pool — among the very few school pools in Muzaffarpur — coached by certified trainers. Swimming is offered as an optional activity for a nominal monthly fee.": "हाँ! हमारे पास एक समर्पित स्विमिंग पूल है — मुजफ्फरपुर के बहुत कम स्कूल पूल्स में से एक — प्रमाणित प्रशिक्षकों द्वारा प्रशिक्षित। तैराकी एक मामूली मासिक शुल्क पर वैकल्पिक गतिविधि के रूप में प्रदान की जाती है।",
  "What is the medium of instruction?": "शिक्षण का माध्यम क्या है?",
  "The medium of instruction is English. However, we also emphasize Hindi and Sanskrit as per CBSE guidelines. Third language options are available from Class 6 onwards.": "शिक्षण का माध्यम अंग्रेज़ी है। हालांकि, हम सीबीएसई दिशानिर्देशों के अनुसार हिंदी और संस्कृत पर भी बल देते हैं। कक्षा 6 से तीसरी भाषा विकल्प उपलब्ध हैं।",
  "Are there sibling concessions available?": "क्या सहोदर छूट उपलब्ध है?",
  "Yes, we offer a sibling concession of 10% on tuition fee for the second child and 15% for the third child. Please contact the school office for detailed concession structure.": "हाँ, हम दूसरे बच्चे के लिए शिक्षण शुल्क पर 10% और तीसरे बच्चे के लिए 15% सहोदर छूट प्रदान करते हैं। विस्तृत छूट संरचना के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",
  "How can I schedule a campus visit?": "मैं परिसर यात्रा कैसे निर्धारित कर सकता हूँ?",
  "You can schedule a campus visit by calling us at +91 9835061341 or by sending an enquiry through the Contact form on this website. Our admissions office is open Monday to Saturday, 8:00 AM to 2:00 PM.": "आप +91 9835061341 पर कॉल करके या इस वेबसाइट पर संपर्क फ़ॉर्म के माध्यम से पूछताछ भेजकर परिसर यात्रा निर्धारित कर सकते हैं। हमारा प्रवेश कार्यालय सोमवार से शनिवार, सुबह 8:00 से दोपहर 2:00 बजे तक खुला है।",
  "What are the school timings?": "विद्यालय का समय क्या है?",
  "Nursery to UKG: 8:00 AM to 12:00 PM (morning shift). Class 1 to Class 12: 8:00 AM to 2:00 PM. Office hours: 8:00 AM to 2:00 PM, Monday to Saturday.": "नर्सरी से यूकेजी: सुबह 8:00 से दोपहर 12:00 (सुबह की पाली)। कक्षा 1 से कक्षा 12: सुबह 8:00 से दोपहर 2:00। कार्यालय समय: सुबह 8:00 से दोपहर 2:00, सोमवार से शनिवार।",
  "Does the school organize cultural and sports events?": "क्या विद्यालय सांस्कृतिक और खेल कार्यक्रमों का आयोजन करता है?",
  "Absolutely! We host an Annual Day, Sports Day, Christmas Carnival, Science Exhibition, Youth Parliament, and various cultural exchange programmes throughout the year. Check our Gallery section for photos of recent events.": "बिल्कुल! हम वर्ष भर में वार्षिकोत्सव, खेल दिवस, क्रिसमस कार्निवल, विज्ञान प्रदर्शनी, युवा संसद, और विभिन्न सांस्कृतिक आदान-प्रदान कार्यक्रमों का आयोजन करते हैं। हाल के कार्यक्रमों की तस्वीरों के लिए हमारा गैलरी अनुभाग देखें।",

  // ─── FACILITIES ───
  "CAMPUS & FACILITIES": "परिसर और सुविधाएँ",
  "Spaces designed for": "के लिए डिज़ाइन किए गए स्थान",
  "discovery": "खोज",
  "Spaces designed for discovery.": "खोज के लिए डिज़ाइन किए गए स्थान।",
  "of thoughtfully designed learning environments on Goshala Road — where every corner invites curiosity.": "गोशाला रोड पर विचारशील ढंग से डिज़ाइन किए गए शिक्षण वातावरण — जहाँ हर कोना जिज्ञासा को आमंत्रित करता है।",
  "Group Photo — Annual Event": "समूह फ़ोटो — वार्षिक कार्यक्रम",
  "Our school family at annual celebrations.": "वार्षिक उत्सव में हमारा विद्यालय परिवार।",
  "Indoor Games": "इंडोर गेम्स",
  "Carrom, chess, table tennis & more.": "कैरम, शतरंज, टेबल टेनिस और बहुत कुछ।",
  "Dance Performance": "नृत्य प्रस्तुति",
  "Classical & contemporary dance rooms in action.": "शास्त्रीय और आधुनिक नृत्य कक्ष एक्शन में।",
  "Christmas Carnival": "क्रिसमस कार्निवल",
  "Annual Christmas Carnival — a Xavier's tradition.": "वार्षिक क्रिसमस कार्निवल — एक ज़ेवियर्स परंपरा।",
  "Campus Life": "परिसर जीवन",
  "Students at the heart of everything we do.": "हम जो कुछ भी करते हैं उसके केंद्र में विद्यार्थी।",
  "School Gallery — 01": "विद्यालय गैलरी — 01",
  "Inside our vibrant campus.": "हमारे जीवंत परिसर के अंदर।",
  "School Gallery — 02": "विद्यालय गैलरी — 02",
  "Hands-on learning across disciplines.": "विषयों में व्यावहारिक शिक्षण।",
  "Sports & Activities": "खेल और गतिविधियाँ",
  "Swimming pool, sports academy & more.": "स्विमिंग पूल, खेल अकादमी और बहुत कुछ।",
  "Green Campus": "हरित परिसर",
  "Classrooms": "कक्षाएँ",
  "Plus Sports Academy": "खेल अकादमी सहित",
  "Safe Fleet": "सुरक्षित बेड़ा",

  // ─── GALLERY ───
  "MOMENTS • CAMPUS LIFE IN PICTURES": "क्षण • चित्रों में परिसर जीवन",
  "Moments • Campus Life in Pictures": "क्षण • चित्रों में परिसर जीवन",
  "A peek into": "एक झलक",
  "Xavier's life": "ज़ेवियर्स जीवन",
  "A peek into Xavier's life.": "ज़ेवियर्स जीवन की एक झलक।",
  "Annual Day Group Photo": "वार्षिकोत्सव समूह फ़ोटो",
  "Indoor Games Session": "इंडोर गेम्स सत्र",
  "School Gallery — 03": "विद्यालय गैलरी — 03",
  "Activities & Sports": "गतिविधियाँ और खेल",
  "All photographs are from the school's official media gallery.": "सभी तस्वीरें विद्यालय की आधिकारिक मीडिया गैलरी से हैं।",
  "No photos in this category yet. Check back soon!": "इस श्रेणी में अभी कोई फ़ोटो नहीं हैं। जल्द ही वापस जाँचें!",
  "Events": "कार्यक्रम",
  "Cultural": "सांस्कृतिक",
  "Sports": "खेल",
  "St. Xavier's Jr./Sr. School, Muzaffarpur": "सेंट ज़ेवियर्स जूनियर/सीनियर विद्यालय, मुजफ्फरपुर",
  "St. Xavier's Jr./Sr. School • Muzaffarpur": "सेंट ज़ेवियर्स जूनियर/सीनियर विद्यालय • मुजफ्फरपुर",
  "St. Xavier's Jr./Sr. School, Muzaffarpur — campus view": "सेंट ज़ेवियर्स जूनियर/सीनियर विद्यालय, मुजफ्फरपुर — परिसर दृश्य",

  // ─── LEADERSHIP ───
  "OUR LEADERSHIP TEAM": "हमारी नेतृत्व टीम",
  "Our Leadership Team": "हमारी नेतृत्व टीम",
  "Meet the people": "लोगों से मिलें",
  "behind Xavier's": "ज़ेवियर्स के पीछे",
  "Meet the people behind Xavier's.": "ज़ेवियर्स के पीछे के लोगों से मिलें।",
  "A dedicated team whose passion, expertise and commitment form the foundation of everything we do — since": "एक समर्पित टीम जिसका जुनून, विशेषज्ञता और प्रतिबद्धता हम जो कुछ भी करते हैं उसकी नींव बनाती है — से",
  "Chairman": "अध्यक्ष",
  "Managing Director": "प्रबंध निदेशक",
  "Joint Director": "संयुक्त निदेशक",
  "Principal": "प्रधानाचार्य",
  "Principal's Message": "प्रधानाचार्य का संदेश",
  "S. Chandra": "एस. चंद्रा",
  "Amitabh Chandra": "अमिताभ चंद्रा",
  "A.K. Dutta": "ए.के. दत्ता",
  "Asha Kiran Sinha": "आशा किरण सिन्हा",
  "Krishna Saraf": "कृष्णा सराफ",
  "Mr. S. Chandra": "श्री एस. चंद्रा",

  // ─── TESTIMONIALS ───
  "VOICES FROM OUR COMMUNITY": "हमारे समुदाय की आवाज़ें",
  "Voices from our community": "हमारे समुदाय की आवाज़ें",
  "Stories from the": "की कहानियाँ",
  "Stories from the Xavier's family.": "ज़ेवियर्स परिवार की कहानियाँ।",
  "AISSCE 2026 Topper • 97.2%": "एएआईएसएससीई 2026 टॉपर • 97.2%",
  "Day Scholar Family • Ramna, Muzaffarpur": "दिवस छात्र परिवार • रमना, मुजफ्फरपुर",
  "PCB Stream • Class 12": "पीसीबी धारा • कक्षा 12",
  "Now pursuing B.Tech, NIT Patna": "अब बी.टेक कर रहे हैं, एनआईटी पटना",
  "Class of 2020 • CA Finalist": "2020 बैच • सीए फाइनलिस्ट",
  "Parent of a Class 10 Student": "कक्षा 10 विद्यार्थी के अभिभावक",
  "Senior Secondary Student": "वरिष्ठ माध्यमिक विद्यार्थी",
  "Alumnus, Batch of 2018": "पूर्व छात्र, 2018 बैच",
  "Commerce Stream Alumna": "वाणिज्य धारा पूर्व छात्रा",
  "St. Xavier's didn't just prepare me for the boards — it made me curious. The teachers knew me by name, knew my weak spots, and refused to let me settle for less. Scoring 97.2% in AISSCE 2026 was only possible because of the after-class doubt sessions and the constant push to aim higher.": "सेंट ज़ेवियर्स ने मुझे केवल बोर्ड के लिए तैयार नहीं किया — इसने मुझे जिज्ञासु बनाया। शिक्षक मुझे नाम से जानते थे, मेरी कमज़ोरियों को जानते थे, और मुझे कम में समझौता करने से इंकार कर दिया। एएआईएसएससीई 2026 में 97.2% अंक प्राप्त करना केवल कक्षा के बाद के संदेह-सत्रों और ऊपर लक्ष्य करने के निरंतर प्रोत्साहन के कारण संभव हुआ।",
  "We chose Xavier's for the CBSE affiliation and stayed for the people. The transport is punctual, the teachers respond within hours, and the campus with its swimming pool and auditorium feels genuinely world-class for Muzaffarpur.": "हमने सीबीएसई संबद्धता के लिए ज़ेवियर्स चुना और लोगों के लिए रुक गए। परिवहन समयनिष्ठ है, शिक्षक घंटों के भीतर जवाब देते हैं, और अपने स्विमिंग पूल और सभागार के साथ परिसर मुजफ्फरपुर के लिए वास्तव में विश्व-स्तरीय महसूस होता है।",
  "What stays with me isn't just the science coaching — it's the morning assemblies, the value-education classes, the way our Principal ma'am makes sure every girl feels heard. The 100% result this year was a team effort between students and teachers.": "मेरे साथ जो रहता है वह केवल विज्ञान कोचिंग नहीं है — यह सुबह की सभाएँ, मूल्य-शिक्षा कक्षाएँ, जिस तरह हमारी प्रधानाचार्य मैडम यह सुनिश्चित करती हैं कि हर लड़की को सुना जाए। इस वर्ष 100% परिणाम विद्यार्थियों और शिक्षकों के बीच एक टीम प्रयास था।",
  "The well-equipped labs at Xavier's made physics and chemistry feel real, not theoretical. When I reached engineering college, I realised how far ahead I was thanks to the hands-on lab culture here. Discipline was drilled into us — and that discipline is what got me through JEE.": "ज़ेवियर्स में सुसज्जित प्रयोगशालाओं ने भौतिकी और रसायन को सैद्धांतिक नहीं, बल्कि वास्तविक महसूस कराया। जब मैं इंजीनियरिंग कॉलेज पहुँचा, तो मुझे एहसास हुआ कि यहाँ की व्यावहारिक प्रयोगशाला संस्कृति के कारण मैं कितना आगे था। हमें अनुशासन में ढाला गया — और वही अनुशासन मुझे जेईई में सफल बनाया।",
  "The Commerce stream at Xavier's was rigorous but never rigid. We did mock stock-market projects, visited local industries, and our Accounts sir refused to let us memorise — he made us understand. That foundation is why I cleared CA Foundation in my first attempt.": "ज़ेवियर्स में वाणिज्य धारा कठोर थी लेकिन कभी अकड़ी हुई नहीं। हमने मॉक शेयर-बाज़ार परियोजनाएँ कीं, स्थानीय उद्योगों का दौरा किया, और हमारे अकाउंट्स सर ने हमें रटने नहीं दिया — उन्होंने हमें समझाया। वही नींव कारण है कि मैंने पहले प्रयास में सीए फाउंडेशन पास किया।",

  // ─── TIMETABLE ───
  "DAILY SCHEDULE • ACADEMIC SESSION 2026–27": "दैनिक कार्यक्रम • शैक्षणिक सत्र 2026–27",
  "Daily Schedule": "दैनिक कार्यक्रम",
  "Class": "कक्षा",
  "timetable": "समय सारिणी",
  "Class timetable.": "कक्षा समय सारिणी।",
  "Timetable shown here is maintained live by the school office. For class-specific schedules, please contact the class teacher.": "यहाँ दिखाई गई समय सारिणी विद्यालय कार्यालय द्वारा लाइव अनुरक्षित है। कक्षा-विशिष्ट कार्यक्रमों के लिए, कृपया कक्षा शिक्षक से संपर्क करें।",
  "Timetable will be published shortly. Please check back later or contact the school office.": "समय सारिणी शीघ्र ही प्रकाशित की जाएगी। कृपया बाद में जाँचें या विद्यालय कार्यालय से संपर्क करें।",
  "No entries": "कोई प्रविष्टि नहीं",
  "periods": "अवधियाँ",
  "Monday": "सोमवार",
  "Tuesday": "मंगलवार",
  "Wednesday": "बुधवार",
  "Thursday": "गुरुवार",
  "Friday": "शुक्रवार",
  "Saturday": "शनिवार",
  "Sunday": "रविवार",
  "Assembly": "सभा",
  "English": "अंग्रेज़ी",
  "Hindi": "हिंदी",
  "Mathematics": "गणित",
  "Science": "विज्ञान",
  "Social Studies": "सामाजिक अध्ययन",
  "Computer": "कंप्यूटर",
  "Sanskrit": "संस्कृत",
  "Physics": "भौतिकी",
  "Chemistry": "रसायन",
  "Biology": "जीव विज्ञान",
  "Physical Education": "शारीरिक शिक्षा",
  "Art & Craft": "कला और शिल्प",
  "Music": "संगीत",
  "Value Education": "मूल्य शिक्षा",
  "Sports / Activities": "खेल / गतिविधियाँ",
  "Science Lab": "विज्ञान प्रयोगशाला",
  "General Schedule": "सामान्य कार्यक्रम",

  // ─── CONTACT ───
  "GET IN TOUCH": "संपर्क में रहें",
  "Get in Touch": "संपर्क में रहें",
  "Come, see the": "आइए, देखें",
  "Come, see the Xavier's difference.": "आइए, ज़ेवियर्स का अंतर देखें।",
  "Visit us on Goshala Road or send a quick enquiry — we'd love to meet your family.": "गोशाला रोड पर हमसे मिलें या एक त्वरित पूछताछ भेजें — हम आपके परिवार से मिलना चाहेंगे।",
  "Visit / Reach Us": "देखें / संपर्क करें",
  "Address": "पता",
  "Phone": "फ़ोन",
  "Email": "ईमेल",
  "Parent / Guardian Name": "अभिभावक का नाम",
  "Email Address": "ईमेल पता",
  "Phone Number": "फ़ोन नंबर",
  "Class Seeking Admission To": "प्रवेश हेतु कक्षा",
  "Message": "संदेश",
  "e.g. Rajesh Kumar": "जैसे राजेश कुमार",
  "you@example.com": "आप@उदाहरण.कॉम",
  "+91 90000 00000": "+91 90000 00000",
  "e.g. Class 6": "जैसे कक्षा 6",
  "Tell us about your child or any specific query…": "हमें अपने बच्चे या किसी विशिष्ट प्रश्न के बारे में बताएं…",
  "Name is required": "नाम आवश्यक है",
  "Name must be at least 2 characters": "नाम कम से कम 2 अक्षर का होना चाहिए",
  "Name too long": "नाम बहुत लंबा है",
  "Email is required": "ईमेल आवश्यक है",
  "Please enter a valid email": "कृपया एक मान्य ईमेल दर्ज करें",
  "Please enter a valid phone number": "कृपया एक मान्य फ़ोन नंबर दर्ज करें",
  "Message too long (max 5000 chars)": "संदेश बहुत लंबा है (अधिकतम 5000 अक्षर)",
  "WhatsApp": "व्हाट्सऐप",
  "St. Xavier's School location": "सेंट ज़ेवियर्स विद्यालय स्थान",
  "Goshala Road, Ramna, Muzaffarpur — 842002 (Bihar)": "गोशाला रोड, रमना, मुजफ्फरपुर — 842002 (बिहार)",
  "📍 Goshala Road, Ramna, Muzaffarpur — 842002 (Bihar)": "📍 गोशाला रोड, रमना, मुजफ्फरपुर — 842002 (बिहार)",

  // ─── FOOTER ───
  "Ready to give your child the Xavier's edge?": "अपने बच्चे को ज़ेवियर्स का लाभ देने के लिए तैयार हैं?",
  "Admissions open for Nursery — Class 12. Limited seats — apply early to avoid disappointment.": "नर्सरी — कक्षा 12 के लिए प्रवेश खुले हैं। सीमित सीटें — निराशा से बचने के लिए जल्दी आवेदन करें।",
  "Admissions open for": "के लिए प्रवेश खुले हैं",
  "Limited seats — apply early to avoid disappointment.": "सीमित सीटें — निराशा से बचने के लिए जल्दी आवेदन करें।",
  "A premier CBSE co-educational institution since 1976, where discipline meets opportunity on Goshala Road, Muzaffarpur.": "1976 से एक प्रमुख सीबीएसई सह-शैक्षिक संस्थान, जहाँ अनुशासन अवसर से मिलता है, गोशाला रोड, मुजफ्फरपुर पर।",
  "Crafted with": "के साथ तैयार",
  "for the St. Xavier's community": "सेंट ज़ेवियर्स समुदाय के लिए",
  "All rights reserved.": "सर्वाधिकार सुरक्षित।",
  "Inspiring Excellence, Empowering Success": "उत्कृष्टता की प्रेरणा, सफलता को सशक्त बनाना",

  // ─── NOTICES (ticker & API) ───
  "Notice": "सूचना",
  "Admissions open for Academic Session 2026-27 — Nursery to Class 11. Limited seats available!": "शैक्षणिक सत्र 2026-27 के लिए प्रवेश खुले हैं — नर्सरी से कक्षा 11 तक। सीमित सीटें उपलब्ध!",
  "AISSCE 2026 Result: 100% pass percentage. Congratulations to topper Krishna Saraf (97.2%)!": "एएआईएसएससीई 2026 परिणाम: 100% उत्तीर्ण प्रतिशत। टॉपर कृष्णा सराफ (97.2%) को बधाई!",
  "Swimming Pool and Sports Academy now open for new enrolments. Contact school office.": "स्विमिंग पूल और खेल अकादमी नए नामांकन के लिए खुले हैं। विद्यालय कार्यालय से संपर्क करें।",
  "Admissions Open for Academic Session 2026-27": "शैक्षणिक सत्र 2026-27 के लिए प्रवेश खुले हैं",
  "Admissions are now open for Nursery to Class 11 for the academic session 2026-27. Registration forms available at the school office. Limited seats — apply early!": "शैक्षणिक सत्र 2026-27 के लिए नर्सरी से कक्षा 11 तक प्रवेश खुले हैं। पंजीकरण फ़ॉर्म विद्यालय कार्यालय में उपलब्ध। सीमित सीटें — जल्दी आवेदन करें!",
  "AISSCE 2026 Result Declared — 100% Pass": "एएआईएसएससीई 2026 परिणाम घोषित — 100% उत्तीर्ण",
  "Class 12 board results declared. 100% pass percentage. Krishna Saraf topped with 97.2%. Congratulations to all students and teachers!": "कक्षा 12 बोर्ड परिणाम घोषित। 100% उत्तीर्ण प्रतिशत। कृष्णा सराफ ने 97.2% के साथ टॉप किया। सभी विद्यार्थियों और शिक्षकों को बधाई!",
  "Summer Vacation Notice": "ग्रीष्मकालीन अवकाश सूचना",
  "School will remain closed for summer vacation from 15th May to 25th June 2026. School reopens on 26th June 2026. Office will remain open 9 AM - 12 PM on weekdays.": "विद्यालय 15 मई से 25 जून 2026 तक ग्रीष्मकालीन अवकाश के लिए बंद रहेगा। विद्यालय 26 जून 2026 को पुनः खुलेगा। कार्यालय सप्ताह के दिनों में सुबह 9 - दोपहर 12 बजे तक खुला रहेगा।",
  "Swimming Pool & Sports Academy Enrolment": "स्विमिंग पूल और खेल अकादमी नामांकन",
  "Swimming pool and Sports Academy enrolment open for new students. Contact the school office for registration and fee details.": "नए विद्यार्थियों के लिए स्विमिंग पूल और खेल अकादमी नामांकन खुला है। पंजीकरण और शुल्क विवरण के लिए विद्यालय कार्यालय से संपर्क करें।",
  "Unit Test 1 Schedule — Classes 6 to 12": "इकाई परीक्षण 1 कार्यक्रम — कक्षा 6 से 12",
  "Unit Test 1 for Classes 6-12 will commence from 15th July 2026. Detailed date sheet available with class teachers. Syllabus uploaded on school portal.": "कक्षा 6-12 के लिए इकाई परीक्षण 1 का आयोजन 15 जुलाई 2026 से शुरू होगा। विस्तृत तिथि-सूची कक्षा शिक्षकों के पास उपलब्ध। पाठ्यक्रम विद्यालय पोर्टल पर अपलोड किया गया।",
  "Parent-Teacher Meeting (PTM)": "अभिभावक-शिक्षक बैठक (पीटीएम)",
  "PTM for all classes scheduled for 10th August 2026, 9:00 AM to 12:00 PM. Parents are requested to attend and collect Unit Test 1 report cards.": "सभी कक्षाओं के लिए पीटीएम 10 अगस्त 2026, सुबह 9:00 से दोपहर 12:00 बजे के लिए निर्धारित। अभिभावकों से उपस्थित होने और इकाई परीक्षण 1 रिपोर्ट कार्ड लेने का अनुरोध है।",
  "Independence Day Celebration": "स्वतंत्रता दिवस समारोह",
  "Independence Day will be celebrated on 15th August 2026. Flag hoisting at 8:00 AM followed by cultural programme. Students to arrive by 7:45 AM in school uniform.": "स्वतंत्रता दिवस 15 अगस्त 2026 को मनाया जाएगा। सुबह 8:00 बजे ध्वजारोहण के बाद सांस्कृतिक कार्यक्रम। विद्यार्थी सुबह 7:45 बजे तक विद्यालय वर्दी में उपस्थित हों।",
  "Diwali Break Notice": "दिवाली अवकाश सूचना",
  "School will remain closed for Diwali break from 20th October to 30th October 2026. School reopens on 31st October 2026.": "विद्यालय 20 अक्टूबर से 30 अक्टूबर 2026 तक दिवाली अवकाश के लिए बंद रहेगा। विद्यालय 31 अक्टूबर 2026 को पुनः खुलेगा।",
  "Annual Day 2026 — Save the Date": "वार्षिकोत्सव 2026 — तिथि सहेजें",
  "Annual Day celebration scheduled for 15th December 2026 at the school auditorium. Cultural performances, prize distribution, and more. Invitations will be sent separately.": "वार्षिकोत्सव समारोह 15 दिसंबर 2026 को विद्यालय सभागार में निर्धारित। सांस्कृतिक प्रस्तुतियाँ, पुरस्कार वितरण, और बहुत कुछ। निमंत्रण अलग से भेजे जाएंगे।",
  "School Transport Route Update": "विद्यालय परिवहन मार्ग अद्यतन",
  "New transport routes added for Sitamarhi and Hajipur. Updated fee structure for new routes available at the school office. Existing routes unchanged.": "सीतामढ़ी और हाजीपुर के लिए नए परिवहन मार्ग जोड़े गए। नए मार्गों के लिए अद्यतन शुल्क संरचना विद्यालय कार्यालय में उपलब्ध। मौजूदा मार्ग अपरिवर्तित।",
  "Winter Timings Effective": "शीतकालीन समय लागू",
  "Winter timings effective from 1st November 2026: Nursery-UKG 9:00 AM - 12:30 PM, Classes 1-12 9:00 AM - 3:00 PM. Office hours 9:00 AM - 2:00 PM.": "1 नवंबर 2026 से शीतकालीन समय लागू: नर्सरी-यूकेजी सुबह 9:00 - दोपहर 12:30, कक्षा 1-12 सुबह 9:00 - दोपहर 3:00। कार्यालय समय सुबह 9:00 - दोपहर 2:00।",
  "Christmas Carnival 2026": "क्रिसमस कार्निवल 2026",
  "Annual Christmas Carnival on 23rd December 2026. Games, food stalls, and cultural programmes. Open to all students and parents. Entry free.": "23 दिसंबर 2026 को वार्षिक क्रिसमस कार्निवल। खेल, खाद्य स्टाल, और सांस्कृतिक कार्यक्रम। सभी विद्यार्थियों और अभिभावकों के लिए खुला। प्रवेश निःशुल्क।",

  // ─── MARQUEE ───

  // ─── OFFLINE ───
  "You're Offline": "आप ऑफ़लाइन हैं",
  "Try Again": "पुनः प्रयास करें",
  "Need to reach us urgently?": "हमसे तत्काल संपर्क करना है?",
  "It looks like you've lost your internet connection. Some content may not be available. Don't worry — once you're back online, the full site will load automatically.": "ऐसा लगता है कि आपका इंटरनेट कनेक्शन टूट गया है। कुछ सामग्री उपलब्ध नहीं हो सकती। चिंता न करें — एक बार ऑनलाइन आने पर, पूरी साइट स्वचालित रूप से लोड हो जाएगी।",

  // ─── WHATSAPP ───
  "Hello! I'm interested in admission at St. Xavier's School. Please share details.": "नमस्ते! मुझे सेंट ज़ेवियर्स विद्यालय में प्रवेश में रुचि है। कृपया विवरण साझा करें।",
  "Chat on WhatsApp": "व्हाट्सऐप पर चैट करें",

  // ─── ACHIEVEMENTS PAGE ───
  "Achievements": "उपलब्धियाँ",
  "EXcellence IN ACTION": "कर्म में उत्कृष्टता",
  "Excellence in action": "कर्म में उत्कृष्टता",
  "Our Achievements": "हमारी उपलब्धियाँ",
  "Nearly five decades of academic excellence, sporting triumphs, and all-round achievement. Here's what our students have accomplished.": "लगभग पाँच दशकों की शैक्षणिक उत्कृष्टता, खेल विजय, और सर्वांगीण उपलब्धि। हमारे विद्यार्थियों ने यह हासिल किया है।",
  "AISSCE Toppers — Year-wise": "एएआईएसएससीई टॉपर — वर्षानुसार",
  "Class 12 board examination toppers over the years": "वर्षों में कक्षा 12 बोर्ड परीक्षा टॉपर",
  "Sports Achievements": "खेल उपलब्धियाँ",
  "Victories at district, state, and inter-school levels": "ज़िला, राज्य और अंतर-विद्यालय स्तर पर विजय",
  "Olympiad Results": "ओलंपियाड परिणाम",
  "National and international academic olympiad achievements": "राष्ट्रीय और अंतर्राष्ट्रीय शैक्षणिक ओलंपियाड उपलब्धियाँ",
  "More to Celebrate": "और भी बहुत कुछ",
  "School Topper": "विद्यालय टॉपर",
  "Commerce Topper": "वाणिज्य टॉपर",
  "PCB Topper": "पीसीबी टॉपर",
  "Science Topper": "विज्ञान टॉपर",
  "100% AISSCE Result": "100% एएआईएसएससीई परिणाम",
  "80+ Awards": "80+ पुरस्कार",
  "Consistent 100% pass rate in Class 12 board exams for the last 5 years.": "पिछले 5 वर्षों से कक्षा 12 बोर्ड परीक्षा में निरंतर 100% उत्तीर्ण दर।",
  "Over 80 awards won across academics, sports, and cultural competitions since 1976.": "1976 से शैक्षणिक, खेल और सांस्कृतिक प्रतियोगिताओं में 80 से अधिक पुरस्कार जीते।",
  "Winners at the district-level Youth Parliament competition for 3 consecutive years.": "लगातार 3 वर्षों तक ज़िला स्तरीय युवा संसद प्रतियोगिता में विजेता।",
  "Multiple state-level science exhibition qualifiers and winners.": "एकाधिक राज्य स्तरीय विज्ञान प्रदर्शनी के चयनित और विजेता।",
  "Science Exhibition": "विज्ञान प्रदर्शनी",
  "Youth Parliament": "युवा संसद",
  "Gold Medal — U-16 Boys": "स्वर्ण पदक — अंडर-16 लड़के",
  "Silver Medal — 100m Sprint": "रजत पदक — 100 मीटर दौड़",
  "Gold Medal — U-16 Girls": "स्वर्ण पदक — अंडर-16 लड़कियाँ",
  "Bronze Medal — U-14 Girls": "कांस्य पदक — अंडर-14 लड़कियाँ",
  "Quarter-Finalist": "क्वार्टर फाइनलिस्ट",
  "Runner-Up": "उप विजेता",
  "School Team": "विद्यालय टीम",
  "3 students in top 1% nationally": "3 विद्यार्थी राष्ट्रीय स्तर पर शीर्ष 1% में",
  "5 Gold medals, 12 students qualified Level 2": "5 स्वर्ण पदक, 12 विद्यार्थी स्तर 2 के लिए चयनित",
  "2 students in state top 10": "2 विद्यार्थी राज्य के शीर्ष 10 में",
  "School rank 1 achieved by 4 students": "4 विद्यार्थियों द्वारा विद्यालय रैंक 1 हासिल की",
  "District Swimming Championship": "ज़िला तैराकी चैंपियनशिप",
  "CBSE Cluster Basketball Tournament": "सीबीएसई क्लस्टर बास्केटबॉल टूर्नामेंट",
  "District Athletics Meet": "ज़िला एथलेटिक्स मीट",
  "Inter-School Cricket Tournament": "अंतर-विद्यालय क्रिकेट टूर्नामेंट",
  "State Yoga Championship": "राज्य योगा चैंपियनशिप",
  "District Table Tennis": "ज़िला टेबल टेनिस",
  "National Science Olympiad (NSO)": "राष्ट्रीय विज्ञान ओलंपियाड (एनएसओ)",
  "International Mathematics Olympiad (IMO)": "अंतर्राष्ट्रीय गणित ओलंपियाड (आईएमओ)",
  "English Olympiad (IEO)": "अंग्रेज़ी ओलंपियाड (आईईओ)",
  "National Cyber Olympiad (NCO)": "राष्ट्रीय साइबर ओलंपियाड (एनसीओ)",

  // ─── FACULTY PAGE ───
  "Faculty": "संकाय",
  "MEET OUR EDUCATORS": "हमारे शिक्षकों से मिलें",
  "Meet our educators": "हमारे शिक्षकों से मिलें",
  "71+ dedicated teachers across 8 departments — the heart and soul of St. Xavier's. Every child is seen, heard, and challenged to become their best.": "8 विभागों में 71+ समर्पित शिक्षक — सेंट ज़ेवियर्स के हृदय और आत्मा। हर बच्चे को देखा, सुना और उसे सर्वश्रेष्ठ बनने के लिए चुनौती दी जाती है।",
  "Including visiting faculty": "विज़िटिंग संकाय सहित",
  "Avg. Experience": "औसत अनुभव",
  "Years per department head": "प्रति विभागाध्यक्ष वर्ष",
  "Student-Teacher Ratio": "विद्यार्थी-शिक्षक अनुपात",
  "Personalized attention": "व्यक्तिगत ध्यान",
  "Trained Faculty": "प्रशिक्षित संकाय",
  "B.Ed. or equivalent": "बी.एड. या समकक्ष",
  "Department-wise Faculty": "विभागानुसार संकाय",
  "Department Head": "विभागाध्यक्ष",
  "faculty members": "संकाय सदस्य",
  "Department": "विभाग",
  "Hindi & Sanskrit": "हिंदी और संस्कृत",
  "Social Science": "सामाजिक विज्ञान",
  "Computer Science": "कंप्यूटर विज्ञान",
  "Arts & Music": "कला और संगीत",
  "Faculty Directory": "संकाय निर्देशिका",
  "This is a representative directory. For the complete and current faculty list, please contact the school office.": "यह एक प्रतिनिधि निर्देशिका है। संपूर्ण और वर्तमान संकाय सूची के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",

  // Faculty qualifications
  "M.Sc., Ph.D. (Physics) — 18 years": "एम.एससी., पीएच.डी. (भौतिकी) — 18 वर्ष",
  "M.Sc. (Chemistry)": "एम.एससी. (रसायन)",
  "M.Sc. (Biology)": "एम.एससी. (जीव विज्ञान)",
  "M.Sc. (Physics)": "एम.एससी. (भौतिकी)",
  "M.Sc. (Maths)": "एम.एससी. (गणित)",
  "M.Sc. (Maths) — 20 years": "एम.एससी. (गणित) — 20 वर्ष",
  "M.A. (English)": "एम.ए. (अंग्रेज़ी)",
  "M.A. (English), B.Ed. — 22 years": "एम.ए. (अंग्रेज़ी), बी.एड. — 22 वर्ष",
  "M.A. (Hindi)": "एम.ए. (हिंदी)",
  "M.A. (Hindi), Ph.D. — 25 years": "एम.ए. (हिंदी), पीएच.डी. — 25 वर्ष",
  "M.A. (History), B.Ed. — 16 years": "एम.ए. (इतिहास), बी.एड. — 16 वर्ष",
  "M.A. (Geography)": "एम.ए. (भूगोल)",
  "M.A. (Pol. Sci.)": "एम.ए. (राजनीति विज्ञान)",
  "M.A. (Sanskrit)": "एम.ए. (संस्कृत)",
  "M.A. (Music)": "एम.ए. (संगीत)",
  "M.Com.": "एम.कॉम.",
  "M.Com., B.Ed. — 19 years": "एम.कॉम., बी.एड. — 19 वर्ष",
  "MBA, M.Com.": "एमबीए, एम.कॉम.",
  "MCA": "एमसीए",
  "MCA, M.Tech. — 12 years": "एमसीए, एम.टेक. — 12 वर्ष",
  "MFA (Visual Arts) — 14 years": "एमएफए (दृश्य कला) — 14 वर्ष",
  "B.Tech. (CS)": "बी.टेक. (सीएस)",
  "BFA": "बीएफए",
  "years": "वर्ष",

  // ─── NOTICE BOARD PAGE ───
  "Notice Board": "सूचना पट्ट",
  "STAY UPDATED": "अपडेट रहें",
  "Stay Updated": "अपडेट रहें",
  "School circulars, holiday notices, exam dates, and important announcements. Check back regularly for updates.": "विद्यालय परिपत्र, अवकाश सूचनाएँ, परीक्षा तिथियाँ, और महत्वपूर्ण घोषणाएँ। अपडेट के लिए नियमित रूप से जाँचें।",
  "Important": "महत्वपूर्ण",
  "Exam": "परीक्षा",
  "Holiday": "अवकाश",
  "Event": "कार्यक्रम",
  "Circular": "परिपत्र",
  "For older notices or specific circulars, please contact the school office.": "पुरानी सूचनाओं या विशिष्ट परिपत्रों के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",
  "Notices are updated regularly — bookmark this page.": "सूचनाएँ नियमित रूप से अद्यतन होती हैं — इस पृष्ठ को बुकमार्क करें।",

  // ─── ALUMNI PAGE ───
  "Alumni": "पूर्व छात्र",
  "OUR EXTENDED FAMILY": "हमारा विस्तारित परिवार",
  "Our extended family": "हमारा विस्तारित परिवार",
  "Nearly five decades of Xavierites — making their mark across India and the world. Once a Xavierite, always a Xavierite.": "लगभग पाँच दशकों के ज़ेवियराइट्स — भारत और दुनिया भर में अपनी छाप छोड़ रहे हैं। एक बार ज़ेवियराइट, हमेशा ज़ेवियराइट।",
  "Alumni by the Decade": "दशकानुसार पूर्व छात्र",
  "Founding decade": "संस्थापक दशक",
  "Growing legacy": "बढ़ती विरासत",
  "Expansion era": "विस्तार युग",
  "Modern era": "आधुनिक युग",
  "Current generation": "वर्तमान पीढ़ी",
  "Where Are They Now?": "वे अब कहाँ हैं?",
  "Stories from Xavierites across the decades": "दशकों में ज़ेवियराइट्स की कहानियाँ",
  "Are you a Xavierite?": "क्या आप एक ज़ेवियराइट हैं?",
  "We'd love to hear from you. Share your story, reconnect with classmates, and mentor current students.": "हम आपसे सुनना चाहेंगे। अपनी कहानी साझा करें, सहपाठियों से फिर से जुड़ें, और वर्तमान विद्यार्थियों का मार्गदर्शन करें।",
  "Batch of": "बैच",
  "Alumni Network": "पूर्व छात्र नेटवर्क",
  "Cardiologist, AIIMS Delhi": "कार्डियोलॉजिस्ट, एम्स दिल्ली",
  "Software Engineer, Google Bangalore": "सॉफ़्टवेयर इंजीनियर, गूगल बैंगलोर",
  "IAS Officer, Bihar Cadre": "आईएएस अधिकारी, बिहार कैडर",
  "Research Scientist, ISRO": "शोध वैज्ञानिक, इसरो",
  "CA, Founder — Agarwal & Associates": "सीए, संस्थापक — अग्रवाल एंड एसोसिएट्स",
  "Architect, Mumbai": "वास्तुकार, मुंबई",
  "Lt. Colonel, Indian Army": "ले. कर्नल, भारतीय सेना",
  "Advocate, Patna High Court": "अधिवक्ता, पटना उच्च न्यायालय",

  // Alumni quotes
  "Xavier's gave me the discipline that got me through medical school. The biology labs here were better equipped than my first year of MBBS.": "ज़ेवियर्स ने मुझे वह अनुशासन दिया जिसने मुझे मेडिकल स्कूल में सफल बनाया। यहाँ की जीव विज्ञान प्रयोगशालाएँ मेरे एमबीबीएस के पहले वर्ष से भी बेहतर सुसज्जित थीं।",
  "The computer science faculty at Xavier's was ahead of its time. I still remember the coding workshops in Class 11 — that's where my tech journey began.": "ज़ेवियर्स में कंप्यूटर विज्ञान संकाय अपने समय से आगे था। मुझे आज भी कक्षा 11 के कोडिंग कार्यशालाएँ याद हैं — वहीं से मेरी तकनीकी यात्रा शुरू हुई।",
  "The values education and youth parliament debates at Xavier's shaped my interest in public service. I owe my civil services career to this school.": "ज़ेवियर्स में मूल्य शिक्षा और युवा संसद बहसों ने मेरी सार्वजनिक सेवा में रुचि को आकार दिया। मैं अपना सिविल सेवा करियर इस विद्यालय को देता हूँ।",
  "My physics teacher at Xavier's, Mr. Sharma, made me fall in love with the subject. Today I build satellites. That journey started in a Class 9 classroom.": "ज़ेवियर्स में मेरे भौतिकी शिक्षक, श्री शर्मा ने मुझे इस विषय से प्रेम करने पर मजबूर कर दिया। आज मैं उपग्रह बनाता हूँ। वह यात्रा कक्षा 9 की कक्षा से शुरू हुई थी।",
  "The Commerce stream at Xavier's was rigorous but never rigid. Our Accounts sir refused to let us memorise — he made us understand. That foundation built my career.": "ज़ेवियर्स में वाणिज्य संकाय कठोर था लेकिन कभी अकड़ा हुआ नहीं। हमारे अकाउंट्स सर ने हमें रटने नहीं दिया — उन्होंने हमें समझाया। उसी नींव ने मेरा करियर बनाया।",
  "Xavier's believed in all-round development. I was equally encouraged in academics and in art class. Today I'm an architect — both sides of my education matter.": "ज़ेवियर्स सर्वांगीण विकास में विश्वास करता था। मुझे शिक्षा में भी और कला कक्षा में भी समान प्रोत्साहन मिला। आज मैं एक वास्तुकार हूँ — मेरी शिक्षा के दोनों पहलू मायने रखते हैं।",
  "The discipline drilled into me at Xavier's — assemblies, uniform inspections, punctuality — prepared me for NDA and the Army. I'm forever grateful.": "ज़ेवियर्स में मुझमें डाला गया अनुशासन — सभाएँ, वर्दी निरीक्षण, समय निष्ठा — ने मुझे एनडीए और सेना के लिए तैयार किया। मैं हमेशा आभारी रहूँगा।",
  "The debating culture at Xavier's — youth parliament, elocution competitions — gave me the confidence to pursue law. I still use those skills every day in court.": "ज़ेवियर्स की बहस संस्कृति — युवा संसद, वाक्पटुता प्रतियोगिताएँ — ने मुझे कानून की पढ़ाई करने का आत्मविश्वास दिया। मैं आज भी अदालत में रोज़ उन कौशल का उपयोग करता हूँ।",

  // ─── PRIVACY POLICY ───
  "Privacy Policy": "गोपनीयता नीति",
  "Terms of Use": "उपयोग की शर्तें",
  "Information We Collect": "हम जो जानकारी एकत्र करते हैं",
  "How We Use Your Information": "हम आपकी जानकारी का उपयोग कैसे करते हैं",
  "Data Storage & Security": "डेटा भंडारण और सुरक्षा",
  "Data Retention": "डेटा प्रतिधारण",
  "Your Rights": "आपके अधिकार",
  "Cookies": "कुकीज़",
  "Children's Privacy": "बाल गोपनीयता",
  "Acceptance of Terms": "शर्तों की स्वीकृति",
  "Use of the Website": "वेबसाइट का उपयोग",
  "Intellectual Property": "बौद्धिक संपदा",
  "Enquiry Submissions": "पूछताछ सबमिशन",
  "External Links": "बाहरी लिंक",
  "Disclaimer": "अस्वीकरण",
  "Limitation of Liability": "देयता की सीमा",
  "Changes to Terms": "शर्तों में परिवर्तन",
  "Governing Law": "प्रवर्तन कानून",
  "Last updated:": "अंतिम अद्यतन:",
  "When you use our website or contact us, we may collect:": "जब आप हमारी वेबसाइट का उपयोग करते हैं या हमसे संपर्क करते हैं, तो हम निम्न एकत्र कर सकते हैं:",
  "Enquiry Form Data:": "पूछताछ फ़ॉर्म डेटा:",
  "Your name, email address, phone number, child's interested grade, and message — only when you voluntarily submit the contact form.": "आपका नाम, ईमेल पता, फ़ोन नंबर, बच्चे की रुचि वाली कक्षा, और संदेश — केवल जब आप स्वेच्छा से संपर्क फ़ॉर्म सबमिट करते हैं।",
  "Usage Data:": "उपयोग डेटा:",
  "Anonymous analytics data such as pages visited, time spent, and approximate location (city/region only, not precise).": "गुमनाम एनालिटिक्स डेटा जैसे देखे गए पृष्ठ, बिताया गया समय, और अनुमानित स्थान (केवल शहर/क्षेत्र, सटीक नहीं)।",
  "Admin Logs:": "व्यवस्थापक लॉग:",
  "When admin staff log in, we record the IP address and action taken for security audit purposes.": "जब व्यवस्थापक स्टाफ लॉग इन करता है, हम सुरक्षा ऑडिट उद्देश्य के लिए आईपी पता और की गई कार्रवाई दर्ज करते हैं।",
  "To respond to your admission enquiries and provide information about our school.": "आपकी प्रवेश पूछताछ का उत्तर देने और हमारे विद्यालय के बारे में जानकारी देने के लिए।",
  "To contact you regarding admissions, fees, or school-related matters.": "प्रवेश, शुल्क, या विद्यालय-संबंधित मामलों के बारे में आपसे संपर्क करने के लिए।",
  "To improve our website and services based on anonymous usage analytics.": "गुमनाम उपयोग एनालिटिक्स के आधार पर हमारी वेबसाइट और सेवाओं में सुधार करने के लिए।",
  "To maintain security logs for audit purposes.": "ऑडिट उद्देश्य के लिए सुरक्षा लॉग बनाए रखने के लिए।",
  "We": "हम",
  "never": "कभी नहीं",
  "sell, rent, or share your personal information with third parties for marketing purposes.": "अपनी व्यक्तिगत जानकारी को विपणन उद्देश्यों के लिए तीसरे पक्षों को बेचते, किराए पर देते, या साझा नहीं करते।",
  "Your enquiry data is stored securely on our hosting provider's servers. Access is restricted to authorized school staff only. Admin sessions are protected with signed cookies and rate-limited login. All communications are encrypted via HTTPS.": "आपकी पूछताछ डेटा हमारे होस्टिंग प्रदाता के सर्वर पर सुरक्षित रूप से संग्रहीत है। पहुँच केवल अधिकृत विद्यालय स्टाफ तक सीमित है। व्यवस्थापक सत्र हस्ताक्षरित कुकीज़ और दर-सीमित लॉगिन से सुरक्षित हैं। सभी संचार एचटीटीटीपीएस द्वारा एन्क्रिप्टेड हैं।",
  "Enquiry submissions are retained for up to": "पूछताछ सबमिशन अधिकतम",
  "from the date of submission, after which they are automatically deleted. If you become a student/parent at the school, your data may be retained as part of school records per CBSE guidelines.": "तक रखे जाते हैं, जिसके बाद उन्हें स्वचालित रूप से हटा दिया जाता है। यदि आप विद्यालय में विद्यार्थी/अभिभावक बनते हैं, तो आपका डेटा सीबीएसई दिशानिर्देशों के अनुसार विद्यालय रिकॉर्ड के हिस्से के रूप में रखा जा सकता है।",
  "You have the right to:": "आपके अधिकार हैं:",
  "Request a copy of the personal data we hold about you.": "आपके बारे में हमारे पास मौजूद व्यक्तिगत डेटा की प्रति का अनुरोध करें।",
  "Request correction of inaccurate data.": "गलत डेटा के सुधार का अनुरोध करें।",
  "Request deletion of your data (subject to legal requirements).": "अपने डेटा के विलोपन का अनुरोध करें (कानूनी आवश्यकताओं के अधीन)।",
  "Opt out of any communications at any time.": "किसी भी समय किसी भी संचार से बाहर निकलें।",
  "To exercise these rights, email us at": "इन अधिकारों का उपयोग करने के लिए, हमें ईमेल करें",
  "Our website uses essential cookies for functioning (theme preference, language preference, admin session). We do not use third-party advertising cookies. Analytics cookies, if enabled, are anonymous and used solely to improve the site.": "हमारी वेबसाइट कामकाज के लिए आवश्यक कुकीज़ का उपयोग करती है (थीम प्राथमिकता, भाषा प्राथमिकता, व्यवस्थापक सत्र)। हम तीसरे पक्ष के विज्ञापन कुकीज़ का उपयोग नहीं करते। एनालिटिक्स कुकीज़, यदि सक्षम हैं, गुमनाम हैं और केवल साइट को बेहतर बनाने के लिए उपयोग की जाती हैं।",
  "Our website is designed for parents and guardians making admission enquiries. We do not knowingly collect personal information directly from children under 13. All enquiries are submitted by adults.": "हमारी वेबसाइट प्रवेश पूछताछ करने वाले अभिभावकों के लिए डिज़ाइन की गई है। हम जानबूझकर 13 वर्ष से कम आयु के बच्चों से सीधे व्यक्तिगत जानकारी एकत्र नहीं करते। सभी पूछताछ वयस्कों द्वारा सबमिट की जाती हैं।",
  "For any privacy-related questions or requests, please contact:": "गोपनीयता-संबंधित किसी भी प्रश्न या अनुरोध के लिए, कृपया संपर्क करें:",
  "By accessing and using this website, you accept and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our website.": "इस वेबसाइट तक पहुँच और उपयोग करके, आप इन उपयोग की शर्तों से बंधने के लिए स्वीकार और सहमत होते हैं। यदि आप इन शर्तों के किसी भी हिस्से से सहमत नहीं हैं, तो कृपया हमारी वेबसाइट का उपयोग न करें।",
  "You agree to use this website only for lawful purposes. You must not:": "आप इस वेबसाइट का उपयोग केवल वैध उद्देश्यों के लिए करने के लिए सहमत हैं। आपको नहीं करना चाहिए:",
  "Submit false or misleading information via the enquiry form.": "पूछताछ फ़ॉर्म के माध्यम से झूठी या भ्रामक जानकारी सबमिट करें।",
  "Attempt to gain unauthorized access to admin areas or backend systems.": "व्यवस्थापक क्षेत्रों या बैकएंड सिस्टम तक अनधिकृत पहुँच प्राप्त करने का प्रयास करें।",
  "Use automated scripts (bots) to spam the contact form or overwhelm our servers.": "संपर्क फ़ॉर्म को स्पैम करने या हमारे सर्वर को अभिभूत करने के लिए स्वचालित स्क्रिप्ट (बॉट) का उपयोग करें।",
  "Reproduce, copy, or distribute content without permission.": "अनुमति के बिना सामग्री को पुनः प्रस्तुत, कॉपी, या वितरित करें।",
  "All content on this website — including text, images, logos, graphics, and design — is the property of St. Xavier's Jr./Sr. School, Muzaffarpur, unless otherwise stated. You may not reproduce, distribute, or create derivative works without prior written consent.": "इस वेबसाइट की सभी सामग्री — टेक्स्ट, छवियाँ, लोगो, ग्राफिक्स, और डिज़ाइन सहित — सेंट ज़ेवियर्स जूनियर/सीनियर विद्यालय, मुजफ्फरपुर की संपत्ति है, जब तक अन्यथा न कहा गया हो। आप पूर्व लिखित सहमति के बिना पुनः प्रस्तुत, वितरित, या व्युत्पन्न कार्य नहीं बना सकते।",
  "The school name, logo, and brand identity are protected trademarks.": "विद्यालय का नाम, लोगो, और ब्रांड पहचान संरक्षित ट्रेडमार्क हैं।",
  "When you submit the enquiry form, you confirm that the information provided is accurate and complete. You grant us permission to contact you regarding your enquiry using the email or phone number provided. You can withdraw this consent at any time by emailing us.": "जब आप पूछताछ फ़ॉर्म सबमिट करते हैं, आप पुष्टि करते हैं कि दी गई जानकारी सटीक और पूर्ण है। आप हमें दिए गए ईमेल या फ़ोन नंबर का उपयोग करके आपकी पूछताछ के बारे में संपर्क करने की अनुमति देते हैं। आप हमें ईमेल करके किसी भी समय यह सहमति वापस ले सकते हैं।",
  "The fee structure displayed on this website is indicative and may change without notice. For the most current and class-specific fee details, please contact the school office directly. Payment of fees is governed by the school's separate fee policy, available at the school office.": "इस वेबसाइट पर दिखाई गई शुल्क संरचना संकेतक है और बिना सूचना के बदल सकती है। सबसे वर्तमान और कक्षा-विशिष्ट शुल्क विवरण के लिए, कृपया सीधे विद्यालय कार्यालय से संपर्क करें। शुल्क का भुगतान विद्यालय की अलग शुल्क नीति द्वारा शासित है, जो विद्यालय कार्यालय में उपलब्ध है।",
  "Our website may contain links to external sites (Instagram, Facebook, Google Maps). We are not responsible for the content or privacy practices of these third-party sites. We recommend reviewing their terms and privacy policies.": "हमारी वेबसाइट में बाहरी साइटों (इंस्टाग्राम, फ़ेसबुक, गूगल मैप्स) के लिंक हो सकते हैं। हम इन तीसरे पक्ष की साइटों की सामग्री या गोपनीयता प्रथाओं के लिए ज़िम्मेदार नहीं हैं। हम उनकी शर्तों और गोपनीयता नीतियों की समीक्षा करने की सिफारिश करते हैं।",
  "The information on this website is provided in good faith. We make no representations or warranties of any kind regarding completeness, accuracy, or reliability. School policies, schedules, and fee structures may change — always verify with the school office.": "इस वेबसाइट पर जानकारी अच्छे विश्वास में प्रदान की जाती है। हम पूर्णता, सटीकता, या विश्वसनीयता के बारे में किसी प्रकार का कोई प्रतिनिधित्व या वारंटी नहीं करते। विद्यालय नीतियाँ, कार्यक्रम, और शुल्क संरचनाएँ बदल सकती हैं — हमेशा विद्यालय कार्यालय से सत्यापित करें।",
  "St. Xavier's Jr./Sr. School shall not be liable for any direct, indirect, or consequential damages arising from the use of this website or reliance on any information contained herein.": "सेंट ज़ेवियर्स जूनियर/सीनियर विद्यालय इस वेबसाइट के उपयोग या इसमें निहित किसी भी जानकारी पर निर्भरता से उत्पन्न किसी भी प्रत्यक्ष, अप्रत्यक्ष, या परिणामी क्षति के लिए उत्तरदायी नहीं होगा।",
  "We reserve the right to update these Terms of Use at any time. Changes will be posted on this page with an updated revision date. Continued use of the website after changes constitutes acceptance of the new terms.": "हम किसी भी समय इन उपयोग की शर्तों को अपडेट करने का अधिकार सुरक्षित रखते हैं। परिवर्तन इस पृष्ठ पर अद्यतन संशोधन तिथि के साथ पोस्ट किए जाएंगे। परिवर्तन के बाद वेबसाइट का निरंतर उपयोग नई शर्तों की स्वीकृति माना जाएगा।",
  "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts in Muzaffarpur, Bihar.": "इन शर्तों पर भारत के कानूनों का शासन है। कोई भी विवाद मुजफ्फरपुर, बिहार की अदालतों के क्षेत्राधिकार के अधीन होगा।",
  "1. Information We Collect": "1. हम जो जानकारी एकत्र करते हैं",
  "2. How We Use Your Information": "2. हम आपकी जानकारी का उपयोग कैसे करते हैं",
  "3. Data Storage & Security": "3. डेटा भंडारण और सुरक्षा",
  "4. Data Retention": "4. डेटा प्रतिधारण",
  "5. Your Rights": "5. आपके अधिकार",
  "6. Cookies": "6. कुकीज़",
  "7. Children's Privacy": "7. बाल गोपनीयता",
  "8. Contact Us": "8. संपर्क करें",
  "1. Acceptance of Terms": "1. शर्तों की स्वीकृति",
  "2. Use of the Website": "2. वेबसाइट का उपयोग",
  "3. Intellectual Property": "3. बौद्धिक संपदा",
  "4. Enquiry Submissions": "4. पूछताछ सबमिशन",
  "5. Fee Structure": "5. शुल्क संरचना",
  "6. External Links": "6. बाहरी लिंक",
  "7. Disclaimer": "7. अस्वीकरण",
  "8. Limitation of Liability": "8. देयता की सीमा",
  "9. Changes to Terms": "9. शर्तों में परिवर्तन",
  "10. Governing Law": "10. प्रवर्तन कानून",
  "11. Contact": "11. संपर्क",

  // ─── ADMIN ───
  "St. Xavier's Admin": "सेंट ज़ेवियर्स व्यवस्थापक",
  "Admin Access": "व्यवस्थापक पहुँच",
  "Admin Code": "व्यवस्थापक कोड",
  "Enter the admin code": "व्यवस्थापक कोड दर्ज करें",
  "Verifying…": "सत्यापित किया जा रहा है…",
  "Authorized personnel only. All access is logged.": "केवल अधिकृत कर्मचारी। सभी पहुँच दर्ज की जाती है।",
  "Welcome back, Admin": "वापसी पर स्वागत है, व्यवस्थापक",
  "Here's what's happening at St. Xavier's today.": "आज सेंट ज़ेवियर्स में यह हो रहा है।",
  "Muzaffarpur • Internal": "मुजफ्फरपुर • आंतरिक",
  "Back to Website": "वेबसाइट पर वापस",
  "Back to website": "वेबसाइट पर वापस",
  "Logout": "लॉगआउट",
  "Enquiries": "पूछताछ",
  "Notices": "सूचनाएँ",
  "FAQs": "प्रश्न",
  "Loading dashboard…": "डैशबोर्ड लोड हो रहा है…",
  "Quick actions": "त्वरित कार्रवाई",
  "New Enquiries": "नई पूछताछ",
  "Total Enquiries": "कुल पूछताछ",
  "Active fee structure": "सक्रिय शुल्क संरचना",
  "Timetable Entries": "समय सारिणी प्रविष्टियाँ",
  "View enquiries": "पूछताछ देखें",
  "Update fees": "शुल्क अद्यतन करें",
  "Edit timetable": "समय सारिणी संपादित करें",
  "Read and reply to new submissions": "नई सबमिशन पढ़ें और उत्तर दें",
  "Manage fee structure rows": "शुल्क संरचना पंक्तियाँ प्रबंधित करें",
  "Add or modify class periods": "कक्षा अवधि जोड़ें या संशोधित करें",
  "Public ticker messages": "सार्वजनिक टिकर संदेश",
  "Public Q&A entries": "सार्वजनिक प्रश्न-उत्तर प्रविष्टियाँ",
  "Actions": "कार्रवाई",
  "Label": "लेबल",
  "Add Fee Row": "शुल्क पंक्ति जोड़ें",
  "Add Notice": "सूचना जोड़ें",
  "Add FAQ": "प्रश्न जोड़ें",
  "Add Entry": "प्रविष्टि जोड़ें",
  "Fee Rows": "शुल्क पंक्तियाँ",
  "Active (show on public site)": "सक्रिय (सार्वजनिक साइट पर दिखाएँ)",
  "Inactive": "निष्क्रिय",
  "Archived": "संग्रहीत",
  "Awaiting response": "उत्तर की प्रतीक्षा",
  "Replied": "उत्तर दिया गया",
  "Select an enquiry from the left to view details and reply.": "विवरण देखने और उत्तर देने के लिए बाईं ओर से एक पूछताछ चुनें।",
  "Send Reply": "उत्तर भेजें",
  "No enquiries found.": "कोई पूछताछ नहीं मिली।",
  "No fee rows yet. Click \"Add Fee Row\" to begin.": "अभी तक कोई शुल्क पंक्ति नहीं। शुरू करने के लिए \"शुल्क पंक्ति जोड़ें\" पर क्लिक करें।",
  "No FAQs yet. Click \"Add FAQ\" to create one.": "अभी तक कोई प्रश्न नहीं। बनाने के लिए \"प्रश्न जोड़ें\" पर क्लिक करें।",
  "No notices yet. Click \"Add Notice\" to create one.": "अभी तक कोई सूचना नहीं। बनाने के लिए \"सूचना जोड़ें\" पर क्लिक करें।",
  "No timetable entries yet. Click \"Add Entry\" to create the first one.": "अभी तक कोई समय सारिणी प्रविष्टि नहीं। पहली बनाने के लिए \"प्रविष्टि जोड़ें\" पर क्लिक करें।",
  "Across all classes": "सभी कक्षाओं में",
  "Active notices": "सक्रिय सूचनाएँ",
  "Active FAQs": "सक्रिय प्रश्न",
  "This week": "इस सप्ताह",
  "All time": "सभी समय",
  "Subject": "विषय",
  "Day": "दिन",
  "Period": "अवधि",
  "Start Time": "प्रारंभ समय",
  "End Time": "समाप्ति समय",
  "Class Grade": "कक्षा",
  "Teacher": "शिक्षक",
  "Room": "कक्ष",
  "Order": "क्रम",
  "Note": "टिप्पणी",
  "Question": "प्रश्न",
  "Answer": "उत्तर",
  "Text": "पाठ",
  "Link": "लिंक",
  "Confirm": "पुष्टि करें",
  "Are you sure?": "क्या आप निश्चित हैं?",
  "This action cannot be undone.": "यह कार्रवाई पूर्ववत नहीं की जा सकती।",
  "Reply": "उत्तर",
  "Subject line": "विषय पंक्ति",
  "Message body": "संदेश भाग",
  "Send": "भेजें",
  "Reply Sent!": "उत्तर भेजा गया!",
  "Failed to send reply. Please try again.": "उत्तर भेजने में विफल। कृपया पुनः प्रयास करें।",
  "No new enquiries": "कोई नई पूछताछ नहीं",
  "Refresh": "ताज़ा करें",
  "Refreshing…": "ताज़ा किया जा रहा है…",
  "Last updated": "अंतिम अद्यतन",
  "Just now": "अभी",
  "minutes ago": "मिनट पहले",
  "hours ago": "घंटे पहले",
  "days ago": "दिन पहले",
  "Pending": "लंबित",
  "Resolved": "हल हुआ",
  "Status": "स्थिति",
  "Date": "तिथि",
  "Time": "समय",
  "From": "से",
  "To": "तक",
  "Reply History": "उत्तर इतिहास",
  "No replies yet.": "अभी तक कोई उत्तर नहीं।",
  "Original Message": "मूल संदेश",
  "Parent / Guardian": "अभिभावक",
  "Grade Interested": "रुचि वाली कक्षा",
  "Submitted": "सबमिट किया गया",
  "Read": "पढ़ें",
  "Unread": "अपठित",
  "Mark as read": "पढ़ा हुआ चिह्नित करें",
  "Mark as unread": "अपठित चिह्नित करें",
  "No fee rows yet. Click “Add Fee Row” to begin.": "अभी तक कोई शुल्क पंक्ति नहीं। शुरू करने के लिए “शुल्क पंक्ति जोड़ें” पर क्लिक करें।",
  "No timetable entries yet. Click “Add Entry” to create the first one.": "अभी तक कोई समय सारिणी प्रविष्टि नहीं। पहली बनाने के लिए “प्रविष्टि जोड़ें” पर क्लिक करें।",
  "Email:": "ईमेल:",
  "replied": "उत्तर दिया गया",

  // ─── COMMON WORD-LEVEL (for partial replacement) ───
  "boys": "लड़के",
  "girls": "लड़कियाँ",
  "medal": "पदक",
  "medals": "पदक",
  "Gold": "स्वर्ण",
  "Silver": "रजत",
  "Bronze": "कांस्य",
  "Champion": "चैंपियन",
  "Championship": "चैंपियनशिप",
  "Tournament": "टूर्नामेंट",
  "Meet": "मीट",
  "Olympiad": "ओलंपियाड",
  "District": "ज़िला",
  "State": "राज्य",
  "National": "राष्ट्रीय",
  "International": "अंतर्राष्ट्रीय",
  "Inter-School": "अंतर-विद्यालय",
  "Engineer": "इंजीनियर",
  "Scientist": "वैज्ञानिक",
  "Officer": "अधिकारी",
  "Architect": "वास्तुकार",
  "Advocate": "अधिवक्ता",
  "Founder": "संस्थापक",
  "Colonel": "कर्नल",
  "Army": "सेना",
  "Cadre": "कैडर",
  "Court": "न्यायालय",
  "High Court": "उच्च न्यायालय",
  "Indian": "भारतीय",
  "Research": "शोध",
  "Software": "सॉफ़्टवेयर",
  "Cardiologist": "कार्डियोलॉजिस्ट",

  // ─── PLACES (transliterated) ───
  "Muzaffarpur": "मुजफ्फरपुर",
  "Ramna": "रमना",
  "Bihar": "बिहार",
  "Sitamarhi": "सीतामढ़ी",
  "Hajipur": "हाजीपुर",
  "Patna": "पटना",
  "Delhi": "दिल्ली",
  "New Delhi": "नई दिल्ली",
  "Bangalore": "बैंगलोर",
  "Mumbai": "मुंबई",
  "India": "भारत",
  "AIIMS Delhi": "एम्स दिल्ली",
  "NIT Patna": "एनआईटी पटना",
  "Patna High Court": "पटना उच्च न्यायालय",
  "Bihar Cadre": "बिहार कैडर",
  "Indian Army": "भारतीय सेना",
  "Google Bangalore": "गूगल बैंगलोर",

  // ─── BRANDS (transliterated) ───
  "Instagram": "इंस्टाग्राम",
  "Facebook": "फ़ेसबुक",
  "Google": "गूगल",
  "Google Maps": "गूगल मैप्स",
  "Amrit Web Solutions": "अमृत वेब सॉल्यूशंस",

  // ─── ACRONYMS ───
  "CBSE": "सीबीएसई",
  "AISSCE": "एएआईएसएससीई",
  "AISSE": "एआईएसएसई",
  "JEE": "जेईई",
  "CA": "सीए",
  "NIT": "एनआईटी",
  "IT": "आईटी",
  "CCTV": "सीसीटीवी",
  "PCM": "पीसीएम",
  "PCB": "पीसीबी",
  "NSO": "एनएसओ",
  "IMO": "आईएमओ",
  "IEO": "आईईओ",
  "NCO": "एनसीओ",
  "PTM": "पीटीएम",
  "NDA": "एनडीए",
  "GPS": "जीपीएस",
  "AIIMS": "एम्स",
  "ISRO": "इसरो",
  "UKG": "यूकेजी",
  "STD": "मानक",

  // ─── PERSON NAMES (transliterated) ───
  "Dr. R. Sharma": "डॉ. आर. शर्मा",
  "Mr. A. Verma": "श्री ए. वर्मा",
  "Mrs. S. Pandey": "श्रीमती एस. पांडेय",
  "Mr. K. Mishra": "श्री के. मिश्रा",
  "Ms. P. Raj": "कुमारी पी. राज",
  "Mr. R. Singh": "श्री आर. सिंह",
  "Mr. S. Choudhary": "श्री एस. चौधरी",
  "Mrs. N. Kumari": "श्रीमती एन. कुमारी",
  "Mr. D. Prasad": "श्री डी. प्रसाद",
  "Ms. R. Gupta": "कुमारी आर. गुप्ता",
  "Mrs. M. Anthony": "श्रीमती एम. एंथनी",
  "Mr. J. Tigga": "श्री जे. टिग्गा",
  "Ms. A. Khan": "कुमारी ए. खान",
  "Mrs. C. Lal": "श्रीमती सी. लाल",
  "Dr. S. Jha": "डॉ. एस. झा",
  "Mr. R. Thakur": "श्री आर. ठाकुर",
  "Mrs. K. Devi": "श्रीमती के. देवी",
  "Mr. P. Singh": "श्री पी. सिंह",
  "Mrs. A. Mishra": "श्रीमती ए. मिश्रा",
  "Mr. V. Kumar": "श्री वी. कुमार",
  "Mr. A. Prasad": "श्री ए. प्रसाद",
  "Mrs. S. Agarwal": "श्रीमती एस. अग्रवाल",
  "Mr. R. Gupta": "श्री आर. गुप्ता",
  "Mr. N. Anand": "श्री एन. आनंद",
  "Ms. T. Kumari": "कुमारी टी. कुमारी",
  "Mr. S. Raj": "श्री एस. राज",
  "Mr. D. Das": "श्री डी. दास",
  "Mrs. L. Tirkey": "श्रीमती एल. तिर्की",
  "Mr. P. Topno": "श्री पी. टोप्नो",
  "Dr. Ankit Raj": "डॉ. अंकित राज",
  "Priya Singh": "प्रिया सिंह",
  "Vikram Choudhary": "विक्रम चौधरी",
  "Dr. Shreya Verma": "डॉ. श्रेया वर्मा",
  "Rohit Agarwal": "रोहित अग्रवाल",
  "Ananya Pandey": "अनन्या पांडेय",
  "Saurabh Kumar": "सौरभ कुमार",
  "Neha Kumari": "नेहा कुमारी",
  "Sneha Gupta": "स्नेहा गुप्ता",
  "Rohit Verma": "रोहित वर्मा",
  "Ananya Singh": "अनन्या सिंह",
  "Vikram Mishra": "विक्रम मिश्रा",
  "Shreya Pandey": "श्रेया पांडेय",
  "Priya Kumari": "प्रिया कुमारी",
  "Aditya Raj": "आदित्य राज",
  "Arnav Kumar": "अर्णव कुमार",
  "Puja Raj": "पूजा राज",
  "Riya Singh": "रिया सिंह",
  "Anshika Verma": "अंशिका वर्मा",
  "Agarwal & Associates": "अग्रवाल एंड एसोसिएट्स",

  // ─── INITIALS (used in testimonials as avatar fallback) ───
  "KS": "के.एस.",
  "PA": "पी.ए.",
  "SS": "एस.एस.",
  "AB": "ए.बी.",
  "AR": "ए.आर.",
  "PS": "पी.एस.",
  "VC": "वी.सी.",
  "SV": "एस.वी.",
  "RA": "आर.ए.",
  "AP": "ए.पी.",
  "SK": "एस.के.",
  "NK": "एन.के.",

  // ─── TIMETABLE PREFIX ───
  "P": "पी.",

  // ─── CENTRAL BOARD ───
  "Central Board of Secondary Education (CBSE), New Delhi": "केंद्रीय माध्यमिक शिक्षा बोर्ड (सीबीएसई), नई दिल्ली",
  "Central Board of Secondary Education (CBSE)": "केंद्रीय माध्यमिक शिक्षा बोर्ड (सीबीएसई)",
  "Central Board of Secondary Education": "केंद्रीय माध्यमिक शिक्षा बोर्ड",
  "up to 10+2 Level": "10+2 स्तर तक",

  // ─── COMMON SHORT WORDS / CONNECTIVES (case-insensitive, Unicode-aware boundaries) ───
  // These are safe to add because the engine uses \p{L} lookbehind/lookahead
  // — they will only match as complete words, not inside other words.
  "on": "पर",
  "in": "में",
  "at": "पर",
  "by": "द्वारा",
  "for": "के लिए",
  "to": "को",
  "from": "से",
  "with": "के साथ",
  "and": "और",
  "or": "या",
  "is": "है",
  "are": "हैं",
  "was": "था",
  "were": "थे",
  "has": "है",
  "have": "हैं",
  "had": "था",
  "this": "यह",
  "that": "वह",
  "these": "ये",
  "those": "वे",
  "they": "वे",
  "he": "वह",
  "she": "वह",
  "it": "यह",
  "you": "आप",
  "your": "आपका",
  "our": "हमारा",
  "their": "उनका",
  "his": "उनका",
  "her": "उनका",
  "its": "इसका",
  "my": "मेरा",
  "me": "मुझे",
  "him": "उन्हें",
  "us": "हमें",
  "them": "उन्हें",
  "be": "होना",
  "been": "हुआ",
  "being": "होते हुए",
  "do": "करें",
  "does": "करता है",
  "did": "किया",
  "doing": "कर रहे हैं",
  "will": "करेगा",
  "would": "करेंगे",
  "can": "कर सकते हैं",
  "could": "कर सकते थे",
  "should": "चाहिए",
  "may": "सकते हैं",
  "might": "सकते थे",
  "must": "अनिवार्य",
  "shall": "करेंगे",
  "not": "नहीं",
  "no": "नहीं",
  "yes": "हाँ",
  "if": "यदि",
  "then": "तब",
  "else": "अन्यथा",
  "when": "जब",
  "where": "जहाँ",
  "why": "क्यों",
  "how": "कैसे",
  "what": "क्या",
  "who": "कौन",
  "whom": "किसे",
  "which": "कौन सा",
  "whose": "किसका",
  "all": "सभी",
  "any": "कोई भी",
  "some": "कुछ",
  "many": "कई",
  "few": "कुछ",
  "more": "अधिक",
  "most": "अधिकांश",
  "less": "कम",
  "least": "कम से कम",
  "very": "बहुत",
  "much": "बहुत",
  "so": "इसलिए",
  "as": "जैसा",
  "also": "भी",
  "but": "लेकिन",
  "because": "क्योंकि",
  "although": "हालांकि",
  "though": "हालांकि",
  "while": "जबकि",
  "during": "के दौरान",
  "before": "से पहले",
  "after": "के बाद",
  "about": "के बारे में",
  "above": "ऊपर",
  "below": "नीचे",
  "up": "ऊपर",
  "down": "नीचे",
  "out": "बाहर",
  "over": "ऊपर",
  "under": "नीचे",
  "again": "फिर से",
  "once": "एक बार",
  "twice": "दो बार",
  "always": "हमेशा",
  "often": "अक्सर",
  "sometimes": "कभी-कभी",
  "usually": "आमतौर पर",
  "now": "अभी",
  "here": "यहाँ",
  "there": "वहाँ",
  "today": "आज",
  "tomorrow": "कल",
  "yesterday": "कल",
  "tonight": "आज रात",
  "soon": "जल्द",
  "later": "बाद में",
  "early": "जल्दी",
  "late": "देर से",
  "every": "हर",
  "each": "प्रत्येक",
  "both": "दोनों",
  "either": "या तो",
  "neither": "न तो",
  "still": "अभी भी",
  "yet": "अभी तक",
  "already": "पहले से",
  "just": "बस",
  "only": "केवल",
  "even": "यहाँ तक कि",
  "too": "भी",
  "well": "अच्छी तरह से",
  "back": "वापस",
  "away": "दूर",
  "off": "बंद",
  "into": "में",
  "onto": "पर",
  "upon": "पर",
  "than": "से",
  "like": "जैसे",
  "such": "ऐसे",
  "other": "अन्य",
  "another": "एक और",
  "same": "वही",
  "different": "अलग",
  "difference": "अंतर",
  "difference.": "अंतर।",
  "premier": "प्रमुख",
  "A premier": "एक प्रमुख",
  "co-educational": "सह-शैक्षिक",
  "institution": "संस्थान",
  "Institution": "संस्थान",
  "discipline": "अनुशासन",
  "meets": "मिलता है",
  "opportunity": "अवसर",
  "where discipline meets opportunity": "जहाँ अनुशासन अवसर से मिलता है",
  "on Goshala Road, Muzaffarpur": "गोशाला रोड, मुजफ्फरपुर पर",
  "A premier CBSE co-educational institution since": "से एक प्रमुख सीबीएसई सह-शैक्षिक संस्थान",
  ", where discipline meets opportunity on Goshala Road, Muzaffarpur.": ", जहाँ अनुशासन अवसर से मिलता है, गोशाला रोड, मुजफ्फरपुर पर।",
  "where discipline meets opportunity on Goshala Road, Muzaffarpur": "जहाँ अनुशासन अवसर से मिलता है, गोशाला रोड, मुजफ्फरपुर पर",
  "new": "नया",
  "old": "पुराना",
  "good": "अच्छा",
  "bad": "बुरा",
  "great": "महान",
  "small": "छोटा",
  "big": "बड़ा",
  "large": "बड़ा",
  "little": "थोड़ा",
  "first": "पहला",
  "last": "अंतिम",
  "next": "अगला",
  "previous": "पिछला",
  "high": "ऊँचा",
  "low": "निम्न",
  "long": "लंबा",
  "short": "छोटा",
  "full": "पूर्ण",
  "empty": "खाली",
  "open": "खुला",
  "close": "बंद करें",
  "start": "शुरू",
  "end": "अंत",
  "begin": "शुरू करें",
  "finish": "समाप्त करें",
  "continue": "जारी रखें",
  "stop": "रुकें",
  "go": "जाएं",
  "come": "आएं",
  "see": "देखें",
  "look": "देखें",
  "find": "ढूंढें",
  "use": "उपयोग",
  "make": "बनाएं",
  "made": "बनाया",
  "take": "लें",
  "took": "लिया",
  "taken": "लिया गया",
  "give": "दें",
  "gave": "दिया",
  "given": "दिया गया",
  "keep": "रखें",
  "let": "दें",
  "put": "रखें",
  "set": "सेट करें",
  "get": "प्राप्त करें",
  "got": "प्राप्त किया",
  "try": "प्रयास करें",
  "tried": "प्रयास किया",
  "call": "कॉल करें",
  "called": "कॉल किया",
  "ask": "पूछें",
  "asked": "पूछा",
  "tell": "बताएं",
  "told": "बताया",
  "said": "कहा",
  "say": "कहें",
  "know": "जानें",
  "knew": "जानता था",
  "known": "ज्ञात",
  "think": "सोचें",
  "thought": "सोचा",
  "feel": "महसूस करें",
  "felt": "महसूस किया",
  "want": "चाहते हैं",
  "wanted": "चाहता था",
  "need": "जरूरत",
  "needed": "जरूरी",
  "loved": "प्यार किया",
  "love": "प्यार",
  "care": "देखभाल",
  "help": "सहायता",
  "helped": "सहायता की",
  "work": "काम",
  "worked": "काम किया",
  "play": "खेलें",
  "played": "खेला",
  "live": "रहते हैं",
  "lived": "रहते थे",
  "stay": "रहें",
  "leave": "छोड़ें",
  "left": "छोड़ दिया",
  "reach": "पहुँचें",
  "reached": "पहुँचा",
  "arrive": "पहुँचें",
  "arrived": "पहुँचा",
  "depart": "प्रस्थान करें",
  "send": "भेजें",
  "sent": "भेजा",
  "receive": "प्राप्त करें",
  "received": "प्राप्त किया",
  "buy": "खरीदें",
  "bought": "खरीदा",
  "sell": "बेचें",
  "sold": "बेचा",
  "pay": "भुगतान करें",
  "paid": "भुगतान किया",
  "cost": "लागत",
  "price": "मूल्य",
  "value": "मूल्य",
  "rate": "दर",
  "fee": "शुल्क",
  "fees": "शुल्क",
  "charge": "शुल्क",
  "free": "निःशुल्क",
  "include": "शामिल करें",
  "included": "शामिल",
  "including": "सहित",
  "exclude": "बाहर रखें",
  "excluded": "बाहर रखा गया",
  "excluding": "को छोड़कर",
  "available": "उपलब्ध",
  "unavailable": "अनुपलब्ध",
  "ready": "तैयार",
  "preparing": "तैयार कर रहे हैं",
  "offer": "प्रस्ताव",
  "offered": "प्रस्ताव दिया",
  "provides": "प्रदान करता है",
  "provided": "प्रदान किया",
  "provide": "प्रदान करें",
  "ensures": "सुनिश्चित करता है",
  "ensure": "सुनिश्चित करें",
  "ensured": "सुनिश्चित किया",
  "maintain": "बनाए रखें",
  "maintained": "बनाए रखा",
  "maintaining": "बनाए रखना",
  "regularly": "नियमित रूप से",
  "currently": "वर्तमान में",
  "throughout": "भर",
  "across": "में",
  "within": "के भीतर",
  "without": "के बिना",
  "along": "के साथ",
  "alongside": "के साथ",
  "towards": "की ओर",
  "around": "के आसपास",
  "between": "के बीच",
  "among": "में",
  "through": "के माध्यम से",
  "since": "से",
  "until": "तक",
  "till": "तक",
  "ago": "पहले",
  "recently": "हाल ही में",
  "previously": "पहले",
  "immediately": "तुरंत",
  "directly": "सीधे",
  "indirectly": "अप्रत्यक्ष रूप से",
  "together": "एक साथ",
  "separately": "अलग से",
  "specifically": "विशेष रूप से",
  "especially": "विशेष रूप से",
  "particularly": "विशेष रूप से",
  "generally": "आम तौर पर",
  "normally": "सामान्य रूप से",
  "commonly": "आम तौर पर",
  "rarely": "शायद ही कभी",
  "hardly": "मुश्किल से",
  "nearly": "लगभग",
  "almost": "लगभग",
  "approximately": "लगभग",
  "roughly": "लगभग",
  "exactly": "ठीक",
  "precisely": "ठीक",
  "completely": "पूरी तरह से",
  "totally": "पूरी तरह से",
  "entirely": "पूरी तरह से",
  "fully": "पूरी तरह से",
  "partially": "आंशिक रूप से",
  "partly": "आंशिक रूप से",
  "mainly": "मुख्य रूप से",
  "mostly": "अधिकतर",
  "largely": "बड़े पैमाने पर",
  "primarily": "मुख्य रूप से",
  "essentially": "अनिवार्य रूप से",
  "basically": "मूल रूप से",
  "actually": "वास्तव में",
  "really": "वास्तव में",
  "truly": "वास्तव में",
  "indeed": "वास्तव में",
  "perhaps": "शायद",
  "maybe": "शायद",
  "possibly": "संभवतः",
  "probably": "संभवतः",
  "certainly": "निश्चित रूप से",
  "definitely": "निश्चित रूप से",
  "absolutely": "बिल्कुल",

  // ─── COMMON TIME/DATE EXPRESSIONS ───
  "up to 10+2 level": "10+2 स्तर तक",
  "Co-Educational English Medium School": "सह-शैक्षिक अंग्रेज़ी माध्यम विद्यालय",

  // ─── STATS / NUMBERS ───
  "97.2%": "97.2%",
  "100%": "100%",
  "80+": "80+",
  "71+": "71+",
  "1,222": "1,222",
  "6,506": "6,506",
  "1976": "1976",
  "1222+": "1222+",
  "6506+": "6506+",
  "71": "71",
  "48": "48",
  "8": "8",
  "17:1": "17:1",

  // ─── COMMON TIME/DATE EXPRESSIONS ───
  "AM": "पूर्वाह्न",
  "PM": "अपराह्न",
  "morning shift": "सुबह की पाली",
  "weekdays": "सप्ताह के दिन",
  "Monday to Saturday": "सोमवार से शनिवार",
};

// ═══════════════════════════════════════════════════════════════
// CASE-INSENSITIVE LOOKUP MAP
// ═══════════════════════════════════════════════════════════════
// Build a lowercased key → translation map for case-insensitive lookup.
// FIRST-WINS: if both "About" and "about" exist as keys, the FIRST one
// (the more specific phrase entry, not the later common-word entry)
// wins. This ensures "About" (navbar link) → "हमारे बारे में" (correct)
// instead of "के बारे में" (the common-word contextual translation).
const LOWER_TO_HI: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const [en, hi] of Object.entries(TRANSLATIONS)) {
    const lower = en.toLowerCase();
    if (!m.has(lower)) {
      m.set(lower, hi);
    }
  }
  return m;
})();

// ═══════════════════════════════════════════════════════════════
// SMART REPLACEMENT ENGINE
// ═══════════════════════════════════════════════════════════════

// Sort translations by key length DESCENDING — longest first
// This ensures "Apply for Admission" matches before "Apply"
const SORTED_ENTRIES = Object.entries(TRANSLATIONS)
  .sort((a, b) => b[0].length - a[0].length);

// Escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Pre-compile regex for each key with UNICODE-AWARE word boundaries.
// We use lookbehind/lookahead with \p{L} and \p{N} (Unicode property escapes)
// so word boundaries work correctly at Latin/Devanagari junctions.
// Without 'u' flag, \b would only work for ASCII word chars.
const COMPILED_REGEXES: { regex: RegExp; hi: string; en: string }[] = SORTED_ENTRIES.map(([en, hi]) => ({
  // (?<![\p{L}\p{N}])  — preceding char must NOT be a letter or digit
  // (?![\p{L}\p{N}])   — following char must NOT be a letter or digit
  // This means the match must be a complete word/phrase boundary.
  // Case-insensitive flag 'i' added so "WHY FAMILIES" matches "Why families".
  regex: new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegex(en)}(?![\\p{L}\\p{N}])`, 'giu'),
  hi,
  en,
}));

// Translate a single string (case-insensitive, Unicode-aware)
function translateString(text: string): string {
  let result = text;

  for (const { regex, hi } of COMPILED_REGEXES) {
    // Quick check: does the regex match anywhere?
    // Reset lastIndex because regex is global
    regex.lastIndex = 0;
    if (!regex.test(result)) continue;
    // Reset again before actual replace
    regex.lastIndex = 0;
    result = result.replace(regex, hi);
  }

  return result;
}

// Check if a string contains Devanagari characters
function hasDevanagari(str: string): boolean {
  return /[\u0900-\u097F]/.test(str);
}

// Check if a string contains Latin alphabet characters
function hasLatin(str: string): boolean {
  return /[a-zA-Z]/.test(str);
}

// ═══════════════════════════════════════════════════════════════
// DOM TRANSLATION
// ═══════════════════════════════════════════════════════════════

// Tags whose text content should NEVER be translated
const SKIP_TAGS = new Set(['script', 'style', 'input', 'textarea', 'noscript', 'code', 'pre', 'kbd', 'samp']);

// WeakMap stores the ORIGINAL English text for each Text node we've processed.
// This survives React's re-renders (as long as React reuses the same Text node),
// and avoids the bug where a parent element with multiple text children would
// have its data-en-original attribute overwritten by each child.
const textNodeOriginals: WeakMap<Text, string> = new WeakMap();

// Track which text nodes we've already RESTORED on switch back to English,
// so we don't double-process.
const restoredSet: WeakSet<Text> = new WeakSet();

// Translate all text nodes under a root element.
// CRITICAL: this reads from textNodeOriginals WeakMap (the saved English text) —
// never from the current textContent (which may already be Hindi). This prevents
// cascading corruption when the MutationObserver fires on already-translated content.
function translateTextNodes(root: Node) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (SKIP_TAGS.has(tag)) return NodeFilter.FILTER_REJECT;
        if (parent.dataset.noTranslate !== undefined) return NodeFilter.FILTER_REJECT;
        const text = node.textContent;
        if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes: Text[] = [];
  let node;
  while (node = walker.nextNode()) nodes.push(node as Text);

  nodes.forEach(textNode => {
    // Get the original English text from WeakMap, or save current content as original.
    // This correctly handles parents with multiple text children — each text node
    // has its own entry in the WeakMap.
    let original = textNodeOriginals.get(textNode);
    if (original === undefined) {
      // First time seeing this text node.
      // The current textContent should be English (just rendered by React).
      // BUT — if MutationObserver re-fires after we've translated, this text node
      // would already have Hindi content. We must NOT save Hindi as "original".
      const current = textNode.textContent || '';
      if (hasDevanagari(current) && !hasLatin(current)) {
        // Already fully Hindi — already processed, skip
        return;
      }
      // If current has both Hindi AND Latin, it's a partially-translated state.
      // We can't safely recover the original — skip to avoid corruption.
      if (hasDevanagari(current) && hasLatin(current)) {
        return;
      }
      // Pure Latin (or no letters at all) — save as original
      original = current;
      textNodeOriginals.set(textNode, original);
    }

    // Skip if original has no Latin chars (numbers, symbols only)
    if (!hasLatin(original)) return;

    const trimmed = original.trim();
    if (!trimmed) return;

    // 1) Try exact full-string lookup (case-insensitive)
    const directHit = LOWER_TO_HI.get(trimmed.toLowerCase());
    if (directHit) {
      // Preserve leading/trailing whitespace from original
      const leadMatch = original.match(/^\s*/);
      const trailMatch = original.match(/\s*$/);
      const lead = leadMatch ? leadMatch[0] : '';
      const trail = trailMatch ? trailMatch[0] : '';
      textNode.textContent = lead + directHit + trail;
      return;
    }

    // 2) Partial replacement (for sentences containing translatable phrases/words)
    const translated = translateString(original);
    if (translated !== original) {
      textNode.textContent = translated;
    }
  });
}

// Translate attributes (placeholder, aria-label, title, alt)
function translateAttributes(root: Node) {
  const elements: Element[] = [];
  if (root.nodeType === Node.DOCUMENT_NODE) {
    elements.push(...Array.from((root as Document).querySelectorAll('*')));
  } else if (root.nodeType === Node.ELEMENT_NODE) {
    elements.push(root as Element);
    elements.push(...Array.from((root as Element).querySelectorAll('*')));
  }

  const attrsToTranslate = ['placeholder', 'aria-label', 'title', 'alt'];

  elements.forEach(el => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.dataset.noTranslate !== undefined) return;
    if (htmlEl.dataset.hiAttrDone === 'true') return;

    let changed = false;
    attrsToTranslate.forEach(attr => {
      const val = htmlEl.getAttribute(attr);
      if (!val) return;
      if (hasDevanagari(val) && !hasLatin(val)) return; // already Hindi

      // Save original attribute (only if not already saved)
      const origKey = `data-en-attr-${attr}`;
      if (htmlEl.getAttribute(origKey) === null) {
        // Don't save if value already has Devanagari (partially translated)
        if (hasDevanagari(val) && hasLatin(val)) return;
        htmlEl.setAttribute(origKey, val);
      }
      const original = htmlEl.getAttribute(origKey) || val;
      if (!hasLatin(original)) return;

      // Try full lookup first
      const direct = LOWER_TO_HI.get(original.trim().toLowerCase());
      if (direct) {
        htmlEl.setAttribute(attr, direct);
        changed = true;
        return;
      }

      const translated = translateString(original);
      if (translated !== original) {
        htmlEl.setAttribute(attr, translated);
        changed = true;
      }
    });
    if (changed) htmlEl.dataset.hiAttrDone = 'true';
  });
}

// Full translation pass
function translateAll() {
  translateTextNodes(document.body);
  translateAttributes(document.body);
}

// Restore all text nodes & attributes to English (from saved originals).
// Uses the WeakMap to find each text node's original — no DOM reload needed.
function restoreAll() {
  // Restore text nodes via TreeWalker — for each text node, if it has an
  // entry in the WeakMap, restore its content from there.
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const text = node.textContent;
        if (!text) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes: Text[] = [];
  let n;
  while (n = walker.nextNode()) nodes.push(n as Text);

  nodes.forEach(textNode => {
    if (restoredSet.has(textNode)) return;
    const original = textNodeOriginals.get(textNode);
    if (original !== undefined) {
      textNode.textContent = original;
      textNodeOriginals.delete(textNode);
      restoredSet.add(textNode);
    }
  });

  // Restore attributes
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
    const htmlEl = el as HTMLElement;
    ['placeholder', 'aria-label', 'title', 'alt'].forEach(attr => {
      const origKey = `data-en-attr-${attr}`;
      const orig = htmlEl.getAttribute(origKey);
      if (orig !== null) {
        htmlEl.setAttribute(attr, orig);
        htmlEl.removeAttribute(origKey);
      }
    });
    delete htmlEl.dataset.hiAttrDone;
  });
}

// ═══════════════════════════════════════════════════════════════
// REACT COMPONENT
// ═══════════════════════════════════════════════════════════════

export function HindiOverlay({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  // Activate Hindi mode
  useEffect(() => {
    if (lang !== 'hi' || !ready) return;

    // Small delay to let React hydrate
    const timeoutId = setTimeout(() => {
      translateAll();
      document.body.dataset.hiActive = 'true';
    }, 50);

    // MutationObserver — catch React re-renders and dynamic content.
    // The translateAll function is now safe to call repeatedly because it
    // always reads from data-en-original (saved on first pass).
    const observer = new MutationObserver((mutations) => {
      let needsTranslate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          needsTranslate = true;
          break;
        }
      }
      if (needsTranslate) {
        // Debounce — batch multiple mutations
        clearTimeout((translateAll as any)._debounce);
        (translateAll as any)._debounce = setTimeout(translateAll, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      clearTimeout((translateAll as any)._debounce);
    };
  }, [lang, ready]);

  // Deactivate Hindi mode — restore from saved originals (no reload)
  useEffect(() => {
    if (lang === 'en' && ready) {
      if (document.body.dataset.hiActive === 'true') {
        document.body.dataset.hiActive = 'false';
        restoreAll();
      }
    }
  }, [lang, ready]);

  return <>{children}</>;
}
