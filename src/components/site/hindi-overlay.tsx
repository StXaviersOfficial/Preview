'use client';

import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/components/site/language-provider";

/**
 * HindiOverlay — applies Hindi translations to the entire DOM via text-node walking.
 *
 * Architecture:
 * 1. Comprehensive translation dictionary (350+ keys)
 * 2. Smart replacement: longest-first, word-boundary aware, regex-escaped
 * 3. MutationObserver catches React re-renders and dynamic content
 * 4. Also translates placeholder, aria-label, title, alt attributes
 * 5. Runs on initial mount + on every DOM change while Hindi is active
 *
 * What stays in English (per user requirement):
 * - School name: "St. Xavier's", "Jr./Sr. School"
 * - Person names: S. Chandra, Amitabh Chandra, A.K. Dutta, Asha Kiran Sinha, Krishna Saraf
 * - Brand names: Amrit Web Solutions, WhatsApp, Instagram, Facebook
 * - Acronyms: CBSE, AISSCE, AISSE, JEE, CA, NIT, PCM, PCB, IT, CCTV
 * - Stream names: PCM, PCB, Commerce, Arts (technical terms)
 */

// ═══════════════════════════════════════════════════════════════
// TRANSLATION DICTIONARY
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS: Record<string, string> = {
  // ═══ NAV ═══
  "Home": "होम",
  "About": "हमारे बारे में",
  "About Us": "हमारे बारे में",
  "Academics": "शैक्षणिक",
  "Campus": "परिसर",
  "Campus & Facilities": "परिसर और सुविधाएँ",
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
  "Admin Login": "व्यवस्थापक लॉगिन",
  "Open menu": "मेनू खोलें",
  "Close menu": "मेनू बंद करें",
  "Switch language": "भाषा बदलें",

  // ═══ HERO ═══
  "Begin Your Journey": "अपनी यात्रा शुरू करें",
  "Explore Campus": "परिसर देखें",
  "Book a Campus Visit": "परिसर भ्रमण बुक करें",
  "Admissions Open · Session 2026–27": "प्रवेश खुले हैं · सत्र 2026–27",
  "Where Discipline Meets Opportunity": "जहाँ अनुशासन मिलता है अवसर से",
  "Nurturing curious minds since 1976, on Goshala Road, Muzaffarpur.": "1976 से गोशाला रोड, मुजफ्फरपुर में जिज्ञासु मन का पोषण।",
  "Scroll": "स्क्रॉल",
  "Students": "विद्यार्थी",

  // ═══ STATS ═══
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
  "Our Vision": "हमारा विज़न",
  "Our Values": "हमारे मूल्य",
  "A legacy of": "की विरासत",
  "excellence": "उत्कृष्टता",
  "on": "पर",
  "Goshala Road": "गोशाला रोड",
  "ESTABLISHED": "स्थापित",
  "NEARLY FIVE DECADES OF LEGACY": "लगभग पाँच दशकों की विरासत",
  "Principal's Message": "प्रधानाचार्य का संदेश",
  "Principal": "प्रधानाचार्य",
  "Founded in": "स्थापित",
  "and administered by the": "द्वारा प्रशासित",
  "under the chairmanship of": "की अध्यक्षता में",
  "is a Co-Educational English Medium School affiliated to CBSE, New Delhi, up to 10+2 level.": "एक सह-शिक्षा अंग्रेज़ी माध्यम विद्यालय है जो सीबीएसई, नई दिल्ली से 10+2 स्तर तक संबद्ध है।",
  "Located on": "स्थित",
  "in a healthy and peaceful locality of Muzaffarpur, the campus spans over two acres of protected, pollution-free land with abundant green surroundings — a congenial setting for serious learning.": "मुजफ्फरपुर के एक स्वस्थ और शांत इलाके में, परिसर दो एकड़ से अधिक संरक्षित, प्रदूषण-मुक्त भूमि पर फैला है जहाँ हरियाली भरपूर है — गंभीर अध्ययन के लिए एक अनुकूल वातावरण।",
  "Managing Society": "प्रबंध समिति",
  "Campus Area": "परिसर क्षेत्र",
  "Years of Trust": "विश्वास के वर्ष",
  "To form young men and women of competence, conscience and compassion — intellectually sharp, morally grounded and socially responsible — ready to lead and serve.": "योग्यता, विवेक और करुणा से युक्त युवा पुरुषों और महिलाओं का निर्माण करना — बौद्धिक रूप से तेज़, नैतिक रूप से दृढ़ और सामाजिक रूप से जिम्मेदार — नेतृत्व और सेवा के लिए तैयार।",
  "To be the most loved and trusted centre of school education in Muzaffarpur — a place where every child is seen, heard and challenged to become the best version of themselves.": "मुजफ्फरपुर का सबसे प्रिय और विश्वसनीय स्कूल शिक्षा केंद्र बनना — ऐकी जगह जहाँ हर बच्चे को देखा, सुना और उसे अपने बेहतरीन रूप में बनने के लिए चुनौती दी जाती है।",
  "Discipline, dignity and devotion. We pair rigorous academics with character formation, so our students leave with both a degree and a moral compass.": "अनुशासन, गरिमा और समर्पण। हम कठोर शिक्षा को चरित्र निर्माण के साथ जोड़ते हैं, ताकि हमारे विद्यार्थी डिग्री और नैतिक दिशा दोनों के साथ आगे बढ़ें।",

  // ═══ ACADEMICS ═══
  "Academic Excellence": "शैक्षणिक उत्कृष्टता",
  "ACADEMIC JOURNEY": "शैक्षणिक यात्रा",
  "From first steps to graduation walk.": "पहले कदम से स्नातक तक।",
  "Pre-Primary": "प्राथमिक पूर्व",
  "Primary": "प्राथमिक",
  "Middle School": "माध्यमिक",
  "Secondary": "माध्यमिक",
  "Senior Secondary": "उच्च माध्यमिक",
  "Senior Secondary Streams": "उच्च माध्यमिक संकाय",
  "Streams": "संकाय",
  "Programme Highlights": "कार्यक्रम की विशेषताएँ",
  "100% Result": "100% परिणाम",
  "Class timetable.": "कक्षा समय सारिणी।",
  "Four pathways. One promise — your child is ready for what comes next.": "चार मार्ग। एक वादा — आपका बच्चा आगे आने वाली हर चुनौती के लिए तैयार है।",
  "Nursery — UKG": "नर्सरी — यूकेजी",
  "Age 3–5": "आयु 3–5",
  "A play-based foundation where curiosity is kindled through stories, songs, art and gentle structure. Focus on motor skills, phonics, socialisation and the joy of learning, in our dedicated colourful Kindergarten wing.": "खेल-आधारित नींव जहाँ कहानियों, गीतों, कला और कोमल संरचना से जिज्ञासा जगाई जाती है। हमारे समर्पित रंगीन किंडरगार्टन विंग में मोटर कौशल, ध्वन्यात्मकता, सामाजीकरण और सीखने के आनंद पर ध्यान केंद्रित किया जाता है।",
  "Dedicated Kindergarten block": "समर्पित किंडरगार्टन ब्लॉक",
  "Phonics & number readiness": "ध्वन्यात्मकता और संख्या तत्परता",
  "Activity-based learning": "गतिविधि-आधारित शिक्षा",
  "Trained early-childhood educators": "प्रशिक्षित प्रारंभिक-बाल्यावस्था शिक्षक",
  "Class 1 — 5": "कक्षा 1 — 5",
  "Age 6–10": "आयु 6–10",
  "Strong literacy, numeracy and inquiry skills are built through experiential learning. Children begin exploring science, social studies, computers and a third language, supported by our 6,500+ book library.": "अनुभवात्मक शिक्षा से मज़बूत साक्षरता, संख्याज्ञान और जांच कौशल का निर्माण होता है। बच्चे विज्ञान, सामाजिक अध्ययन, कंप्यूटर और तीसरी भाषा का अन्वेषण शुरू करते हैं, हमारी 6,500+ पुस्तकों की लाइब्रेरी के समर्थन से।",
  "Reading & writing fluency programmes": "पठन और लेखन प्रवाह कार्यक्रम",
  "Hands-on EVS projects": "व्यावहारिक पर्यावरण अध्ययन परियोजनाएँ",
  "Computer education from Class 1": "कक्षा 1 से कंप्यूटर शिक्षा",
  "Annual sport & cultural houses": "वार्षिक खेल और सांस्कृतिक गृह",
  "Class 6 — 8": "कक्षा 6 — 8",
  "Age 11–13": "आयु 11–13",
  "Conceptual depth increases across all CBSE subjects. Students rotate through our Physics, Chemistry, Biology and Computer labs, take up science exhibitions and begin structured career-awareness conversations.": "सभी सीबीएसई विषयों में वैचारिक गहराई बढ़ती है। विद्यार्थी हमारी भौतिकी, रसायन, जीव विज्ञान और कंप्यूटर प्रयोगशालाओं में घूमते हैं, विज्ञान प्रदर्शनी में भाग लेते हैं और संरचित करियर-जागरूकता चर्चा शुरू करते हैं।",
  "Subject-specialist faculty": "विषय-विशेषज्ञ संकाय",
  "Well-equipped science labs": "सुसज्जित विज्ञान प्रयोगशालाएं",
  "Mandatory library hours": "अनिवार्य पुस्तकालय समय",
  "Science exhibition & seminars": "विज्ञान प्रदर्शनी और संगोष्ठियां",
  "Class 9 — 10": "कक्षा 9 — 10",
  "Age 14–15": "आयु 14–15",
  "Focused CBSE Board preparation (AISSE) with rigorous assessments, doubt-clearing cells and personalised mentoring. Every student is paired with a teacher-mentor for the year.": "कठोर मूल्यांकन, संदेह-समाधान कक्षों और व्यक्तिगत मार्गदर्शन के साथ केंद्रित सीबीएसई बोर्ड (AISSE) की तैयारी। हर विद्यार्थी को वर्ष के लिए एक शिक्षक-मार्गदर्शक के साथ जोड़ा जाता है।",
  "Board-exam strategy workshops": "बोर्ड परीक्षा रणनीति कार्यशालाएं",
  "Regular tests & analysis": "नियमित परीक्षण और विश्लेषण",
  "Mentor-mentee pairing": "मार्गदर्शक-शिष्य युग्मन",
  "Life-skills & value education": "जीवन-कौशल और मूल्य शिक्षा",
  "Class 11 — 12": "कक्षा 11 — 12",
  "Age 16–17": "आयु 16–17",
  "Four streams — PCM, PCB, Commerce and Arts — affiliated to CBSE up to 10+2. Recent AISSCE 2026 topper Krishna Saraf scored 97.2%, with 100% result for the batch.": "चार संकाय — PCM, PCB, वाणिज्य और कला — सीबीएसई से 10+2 तक संबद्ध। हाल के AISSCE 2026 टॉपर कृष्णा सराफ ने 97.2% अंक प्राप्त किए, बैच का 100% परिणाम रहा।",
  "Youth parliament & workshops": "युवा संसद और कार्यशालाएं",
  "Dedicated senior study lounges": "समर्पित वरिष्ठ अध्ययन लाउंज",
  "Physics • Chemistry • Mathematics • Optional CS": "भौतिकी • रसायन • गणित • वैकल्पिक सीएस",
  "Physics • Chemistry • Biology • Optional Maths": "भौतिकी • रसायन • जीव विज्ञान • वैकल्पिक गणित",
  "Accountancy • Business Studies • Economics • Maths": "लेखाशास्त्र • व्यवसाय अध्ययन • अर्थशास्त्र • गणित",
  "History • Political Science • Geography • Psychology": "इतिहास • राजनीति विज्ञान • भूगोल • मनोविज्ञान",

  // ═══ ADMISSIONS ═══
  "ADMISSIONS OPEN • SESSION 2026 – 27": "प्रवेश खुले हैं • सत्र 2026 – 27",
  "Admissions Open • Session 2026 – 27": "प्रवेश खुले हैं • सत्र 2026 – 27",
  "Four steps to admission.": "प्रवेश के चार चरण।",
  "A simple, transparent admission process for Nursery to Std. XII. Reach out at any stage — our admissions team is happy to walk you through it.": "नर्सरी से कक्षा 12 तक के लिए एक सरल, पारदर्शी प्रवेश प्रक्रिया। किसी भी चरण पर संपर्क करें — हमारी प्रवेश टीम आपको मार्गदर्शन के लिए प्रसन्न है।",
  "Registration": "पंजीकरण",
  "Collect & submit the Registration Form from the school office along with the registration fee and required documents.": "पंजीकरण शुल्क और आवश्यक दस्तावेज़ों के साथ विद्यालय कार्यालय से पंजीकरण फ़ॉर्म लें और जमा करें।",
  "~30 min at office": "कार्यालय में ~30 मिनट",
  "Interaction / Assessment": "संवाद / मूल्यांकन",
  "An age-appropriate interaction (Nursery–Class 1) or written assessment (Class 2 onwards) to understand the child's readiness.": "बच्चे की तत्परता को समझने के लिए आयु-उपयुक्त संवाद (नर्सरी–कक्षा 1) या लिखित मूल्यांकन (कक्षा 2 से आगे)।",
  "~1–2 hours": "~1–2 घंटे",
  "Offer & Confirmation": "प्रस्ताव और पुष्टि",
  "Selected candidates receive a provisional admission offer. Confirm the seat by paying the first instalment to lock it in.": "चयनित उम्मीदवारों को अनंतिम प्रवेश प्रस्ताव मिलता है। सीट की पुष्टि के लिए पहली किस्त जमा करें।",
  "~30 min confirmation": "~30 मिनट पुष्टि",
  "Fee Payment & Joining": "शुल्क भुगतान और प्रवेश",
  "Complete fee formalities, submit original documents and collect uniform, books and the joining kit. Welcome to Xavier's!": "शुल्क के औपचारिक कार्य पूरे करें, मूल दस्तावेज़ जमा करें और वर्दी, किताबें और ज्वाइनिंग किट लें। ज़ेवियर्स में आपका स्वागत है!",
  "~1 hour for kit": "किट के लिए ~1 घंटा",
  "Documents to bring": "लाने योग्य दस्तावेज़",
  "Keep these ready to make registration a breeze.": "पंजीकरण आसान बनाने के लिए ये तैयार रखें।",
  "Birth certificate (photocopy & original)": "जन्म प्रमाण पत्र (फ़ोटोकॉपी और मूल)",
  "4 recent passport-size photographs": "4 हाल की पासपोर्ट-साइज़ तस्वीरें",
  "Aadhaar card of student & parents": "विद्यार्थी और अभिभावक का आधार कार्ड",
  "Previous school's Transfer Certificate (Class 2+)": "पिछले विद्यालय का स्थानांतरण प्रमाण पत्र (कक्षा 2+)",
  "Last report card / mark sheet": "अंतिम रिपोर्ट कार्ड / अंक-सूची",
  "Caste / income certificate (if applicable)": "जाति / आय प्रमाण पत्र (यदि लागू हो)",
  "Apply for Admission": "प्रवेश हेतु आवेदन करें",
  "Send an Enquiry": "पूछताछ भेजें",
  "Send Another Enquiry": "एक और पूछताछ भेजें",
  "Have a question about admissions or fees?": "प्रवेश या शुल्क के बारे में कोई प्रश्न?",
  "Speak directly with our Admissions Office for the latest fee structure, important dates, and any queries. We're happy to help.": "नवीनतम शुल्क संरचना, महत्वपूर्ण तिथियों और किसी भी प्रश्न के लिए सीधे हमारे प्रवेश कार्यालय से बात करें। हम सहायता के लिए प्रसन्न हैं।",

  // ═══ FEES ═══
  "Fee Structure": "शुल्क संरचना",
  "FEE STRUCTURE • ACADEMIC SESSION 2026–27": "शुल्क संरचना • शैक्षणिक सत्र 2026–27",
  "Transparent fee structure.": "पारदर्शी शुल्क संरचना।",
  "Transparent and competitive": "पारदर्शी और प्रतिस्पर्धी",
  "All charges are listed below with no hidden costs. For class-specific variations, concessions, or sibling discounts, please contact the school office.": "सभी शुल्क नीचे सूचीबद्ध हैं, कोई छिपा हुआ शुल्क नहीं। कक्षा-विशिष्ट भिन्नताओं, छूट, या सहोदर छूट के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",
  "Particulars": "विवरण",
  "Category": "श्रेणी",
  "Frequency": "आवृत्ति",
  "Amount (₹)": "राशि (₹)",
  "All Categories": "सभी श्रेणियाँ",
  "Loading fee structure…": "शुल्क संरचना लोड हो रही है…",
  "Fee details will be published shortly. Please contact the school office for the latest structure.": "शुल्क विवरण शीघ्र प्रकाशित किए जाएंगे। नवीनतम संरचना के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",
  "Approx. Yearly Total": "अनुमानित वार्षिक कुल",
  "(excluding one-time fees)": "(एकमुश्त शुल्क छोड़कर)",
  "Admission": "प्रवेश शुल्क",
  "Tuition": "शिक्षण शुल्क",
  "Transport": "परिवहन",
  "Development": "विकास शुल्क",
  "All": "सभी",
  "Have questions about fees or concessions?": "शुल्क या छूट के बारे में प्रश्न?",
  "Our office can clarify class-wise variations, sibling discounts, and instalment options.": "हमारा कार्यालय कक्षा-वार भिन्नताओं, सहोदर छूट और किस्त विकल्पों को स्पष्ट कर सकता है।",
  "Enquire": "पूछताछ",
  "Failed to load fee structure. Please try again later.": "शुल्क संरचना लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",

  // ═══ FAQ ═══
  "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
  "FREQUENTLY ASKED QUESTIONS": "अक्सर पूछे जाने वाले प्रश्न",
  "Got questions? We've got answers.": "प्रश्न हैं? हमारे पास उत्तर हैं।",
  "Everything parents ask us — about admissions, facilities, academics and life at Xavier's.": "अभिभावकों द्वारा पूछे जाने वाले सभी प्रश्न — प्रवेश, सुविधाओं, शिक्षा और ज़ेवियर्स के जीवन के बारे में।",
  "Loading FAQs…": "प्रश्न लोड हो रहे हैं…",
  "Failed to load FAQs. Please try again later.": "प्रश्न लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",
  "No FAQs available right now. Please contact the school office for any questions.": "अभी कोई प्रश्न उपलब्ध नहीं। किसी भी प्रश्न के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",
  "Still have a question?": "अभी भी प्रश्न है?",
  "Our office is happy to help with anything not covered above.": "ऊपर शामिल नहीं किए गए किसी भी विषय पर हमारा कार्यालय सहायता के लिए प्रसन्न है।",
  "Contact Us": "संपर्क करें",

  // ═══ FACILITIES ═══
  "CAMPUS & FACILITIES": "परिसर और सुविधाएँ",
  "Campus &": "परिसर और",
  "Facilities": "सुविधाएँ",
  "Spaces designed for discovery.": "खोज के लिए डिज़ाइन किए गए स्थान।",
  "of thoughtfully designed learning environments on Goshala Road — where every corner invites curiosity.": "गोशाला रोड पर विचारपूर्वक डिज़ाइन किए गए शिक्षण वातावरण — जहाँ हर कोना जिज्ञासा को आमंत्रित करता है।",
  "Green Campus": "हरा-भरा परिसर",
  "Plus Sports Academy": "साथ में खेल अकादमी",
  "Safe Fleet": "सुरक्षित बेड़ा",
  "Classrooms": "कक्षाकक्ष",
  "Group Photo — Annual Event": "समूह फ़ोटो — वार्षिक कार्यक्रम",
  "Our school family at annual celebrations.": "वार्षिक उत्सव में हमारा विद्यालय परिवार।",
  "Indoor Games": "इनडोर खेल",
  "Carrom, chess, table tennis & more.": "कैरम, शतरंज, टेबल टेनिस और अधिक।",
  "Dance Performance": "नृत्य प्रस्तुति",
  "Classical & contemporary dance rooms in action.": "शास्त्रीय और आधुनिक नृत्य कक्षों में गतिविधि।",
  "Christmas Carnival": "क्रिसमस कार्निवल",
  "Annual Christmas Carnival — a Xavier's tradition.": "वार्षिक क्रिसमस कार्निवल — ज़ेवियर्स की परंपरा।",
  "Campus Life": "परिसर जीवन",
  "Students at the heart of everything we do.": "हमारे हर काम के केंद्र में विद्यार्थी।",
  "School Gallery — 01": "विद्यालय गैलरी — 01",
  "Inside our vibrant campus.": "हमारे जीवंत परिसर के अंदर।",
  "School Gallery — 02": "विद्यालय गैलरी — 02",
  "Hands-on learning across disciplines.": "विषयों में व्यावहारिक शिक्षा।",
  "Sports & Activities": "खेल और गतिविधियाँ",
  "School Gallery — 03": "विद्यालय गैलरी — 03",
  "Swimming pool, sports academy & more.": "स्विमिंग पूल, खेल अकादमी और अधिक।",

  // ═══ GALLERY ═══
  "MOMENTS • CAMPUS LIFE IN PICTURES": "क्षण • चित्रों में परिसर जीवन",
  "A peek into Xavier's life.": "ज़ेवियर्स जीवन में एक झलक।",
  "Annual Day Group Photo": "वार्षिकोत्सव समूह फ़ोटो",
  "Indoor Games Session": "इनडोर खेल सत्र",
  "Activities & Sports": "गतिविधियाँ और खेल",
  "Events": "कार्यक्रम",
  "Sports": "खेल",
  "Cultural": "सांस्कृतिक",
  "All photographs are from the school's official media gallery.": "सभी तस्वीरें विद्यालय की आधिकारिक मीडिया गैलरी से हैं।",

  // ═══ LEADERSHIP ═══
  "OUR LEADERSHIP TEAM": "हमारी नेतृत्व टीम",
  "Leadership": "नेतृत्व",
  "Meet the people behind Xavier's.": "ज़ेवियर्स के पीछे के लोगों से मिलें।",
  "A dedicated team whose passion, expertise and commitment form the foundation of everything we do — since 1976.": "एक समर्पित टीम जिसका जुनून, विशेषज्ञता और प्रतिबद्धता हमारे हर काम की नींव बनाती है — 1976 से।",
  "Chairman": "अध्यक्ष",
  "Managing Director": "प्रबंध निदेशक",
  "Joint Director": "संयुक्त निदेशक",

  // ═══ TESTIMONIALS ═══
  "VOICES FROM OUR COMMUNITY": "हमारे समुदाय की आवाज़ें",
  "Stories from the Xavier's family.": "ज़ेवियर्स परिवार की कहानियाँ।",
  "AISSCE 2026 Topper • 97.2%": "AISSCE 2026 टॉपर • 97.2%",
  "Day Scholar Family • Ramna, Muzaffarpur": "दिवस विद्यार्थी परिवार • रमना, मुजफ्फरपुर",
  "PCB Stream • Class 12": "PCB संकाय • कक्षा 12",
  "Now pursuing B.Tech, NIT Patna": "अब B.Tech कर रहे हैं, NIT पटना",
  "Class of 2020 • CA Finalist": "2020 बैच • CA फाइनलिस्ट",
  "Parent of a Class 10 Student": "कक्षा 10 विद्यार्थी के अभिभावक",
  "Senior Secondary Student": "उच्च माध्यमिक विद्यार्थी",
  "Alumnus, Batch of 2018": "पूर्व छात्र, 2018 बैच",
  "Commerce Stream Alumna": "वाणिज्य संकाय की पूर्व छात्रा",

  // ═══ TIMETABLE ═══
  "DAILY SCHEDULE • ACADEMIC SESSION 2026–27": "दैनिक कार्यक्रम • शैक्षणिक सत्र 2026–27",
  "Class": "कक्षा",
  "Loading timetable…": "समय सारिणी लोड हो रही है…",
  "No entries": "कोई प्रविष्टि नहीं",
  "periods": "अवधि",
  "Timetable will be published shortly. Please check back later or contact the school office.": "समय सारिणी शीघ्र प्रकाशित की जाएगी। कृपया बाद में पुनः जाँचें या विद्यालय कार्यालय से संपर्क करें।",
  "Timetable shown here is maintained live by the school office. For class-specific schedules, please contact the class teacher.": "यहाँ दिखाई गई समय सारिणी विद्यालय कार्यालय द्वारा लाइव अद्यतन रखी जाती है। कक्षा-विशिष्ट कार्यक्रम के लिए कृपया कक्षा शिक्षक से संपर्क करें।",
  "Monday": "सोमवार",
  "Tuesday": "मंगलवार",
  "Wednesday": "बुधवार",
  "Thursday": "गुरुवार",
  "Friday": "शुक्रवार",
  "Saturday": "शनिवार",

  // ═══ CONTACT ═══
  "GET IN TOUCH": "संपर्क करें",
  "Get in Touch": "संपर्क करें",
  "Come, see the Xavier's difference.": "आइए, ज़ेवियर्स का अंतर देखें।",
  "We'd love to hear from you": "हम आपसे सुनना चाहेंगे",
  "Visit / Reach Us": "भ्रमण करें / संपर्क करें",
  "Visit us on Goshala Road or send a quick enquiry — we'd love to meet your family.": "गोशाला रोड पर हमसे मिलें या एक त्वरित पूछताछ भेजें — हम आपके परिवार से मिलना चाहेंगे।",
  "Phone": "फ़ोन",
  "Email": "ईमेल",
  "Address": "पता",
  "Parent / Guardian Name": "अभिभावक का नाम",
  "Your Name": "आपका नाम",
  "Email Address": "ईमेल पता",
  "Phone Number": "फ़ोन नंबर",
  "Class Seeking Admission To": "प्रवेश हेतु इच्छित कक्षा",
  "Grade Interested In": "रुचि वाली कक्षा",
  "Message": "संदेश",
  "Your Message": "आपका संदेश",
  "Send Enquiry": "पूछताछ भेजें",
  "Sending…": "भेजा जा रहा है…",
  "Enquiry Received!": "पूछताछ प्राप्त हुई!",
  "Thank you for reaching out to St. Xavier's. We've received your enquiry and will get back to you shortly. For urgent queries, please call us directly.": "सेंट ज़ेवियर्स में संपर्क करने के लिए धन्यवाद। हमें आपकी पूछताछ प्राप्त हुई है और हम जल्द ही आपसे संपर्क करेंगे। तत्काल प्रश्नों के लिए कृपया सीधे फ़ोन करें।",
  "Tell us about your child or any specific query…": "अपने बच्चे के बारे में या किसी विशिष्ट प्रश्न में बताएं…",
  "e.g. Rajesh Kumar": "जैसे राजेश कुमार",
  "e.g. Class 6": "जैसे कक्षा 6",

  // ═══ FOOTER ═══
  "Ready to give your child the Xavier's edge?": "अपने बच्चे को ज़ेवियर्स का लाभ देने के लिए तैयार हैं?",
  "Admissions open for Nursery — Class 12. Limited seats — apply early to avoid disappointment.": "नर्सरी से कक्षा 12 तक प्रवेश खुले हैं। सीमित सीटें — निराशा से बचने के लिए जल्दी आवेदन करें।",
  "All rights reserved.": "सर्वाधिकार सुरक्षित।",
  "Crafted with": "निर्मित",
  "for the St. Xavier's community": "सेंट ज़ेवियर्स समुदाय के लिए",
  "A premier CBSE co-educational institution since 1976, where discipline meets opportunity on Goshala Road, Muzaffarpur.": "1976 से एक प्रमुख सीबीएसई सह-शिक्षा संस्थान, जहाँ अनुशासन मिलता है अवसर से, गोशाला रोड, मुजफ्फरपुर में।",

  // ═══ NOTICE TICKER ═══
  "Dismiss notice": "सूचना बंद करें",
  "Notice": "सूचना",

  // ═══ FEATURES ═══
  "WHY FAMILIES CHOOSE ST. XAVIER'S": "परिवार सेंट ज़ेवियर्स क्यों चुनते हैं",
  "Why Families Choose St. Xavier's": "परिवार सेंट ज़ेवियर्स क्यों चुनते हैं",
  "World-class facilities, for every student.": "हर विद्यार्थी के लिए विश्व-स्तरीय सुविधाएँ।",
  "Swimming Pool": "स्विमिंग पूल",
  "Sports Academy": "खेल अकादमी",
  "A dedicated swimming pool — among the very few school pools in Muzaffarpur — coached by certified trainers.": "मुजफ्फरपुर के कुछ विद्यालय पूल में से एक — प्रमाणित प्रशिक्षकों द्वारा प्रशिक्षित।",
  "Well-Equipped Labs": "सुसज्जित प्रयोगशालाएं",
  "Modern Physics, Chemistry, Biology, Computer & Language labs providing hands-on scientific curiosity.": "आधुनिक भौतिकी, रसायन, जीव विज्ञान, कंप्यूटर और भाषा प्रयोगशालाएं व्यावहारिक वैज्ञानिक जिज्ञासा प्रदान करती हैं।",
  "Structured sports academy with basketball, indoor games, yoga, aerobics and annual sports day events.": "बास्केटबॉल, इनडोर खेल, योग, एरोबिक्स और वार्षिक खेल दिवस कार्यक्रमों के साथ संरचित खेल अकादमी।",
  "Auditorium": "सभागार",
  "A full-fledged auditorium hosting annual day, seminars, youth parliament and cultural performances.": "वार्षिकोत्सव, संगोष्ठियों, युवा संसद और सांस्कृतिक प्रस्तुतियों के लिए पूर्ण सभागार।",
  "Music & Dance Rooms": "संगीत और नृत्य कक्ष",
  "Dedicated music rooms and dance rooms nurturing both classical and contemporary performing arts.": "शास्त्रीय और आधुनिक कला के लिए समर्पित संगीत और नृत्य कक्ष।",
  "Library": "पुस्तकालय",
  "books, journals and reference material fostering a lifelong reading culture.": "पुस्तकें, पत्रिकाएँ और संदर्भ सामग्री आजीवन पठन संस्कृति को बढ़ावा देती हैं।",
  "Over": "से अधिक",
  "IT Infrastructure": "आईटी ढांचा",
  "Smart classrooms and modern IT infrastructure with high-speed connectivity across the campus.": "स्मार्ट कक्षाएं और परिसर भर में उच्च-गति कनेक्टिविटी के साथ आधुनिक आईटी ढांचा।",
  "Security & CCTV": "सुरक्षा और सीसीटीवी",
  "Round-the-clock CCTV surveillance and trained security personnel for complete peace of mind.": "पूर्ण मन की शांति के लिए 24x7 सीसीटीवी निगरानी और प्रशिक्षित सुरक्षा कर्मी।",
  "Medical Facility": "चिकित्सा सुविधा",
  "On-campus medical facility with regular health and medical check-ups for every student.": "हर विद्यार्थी के लिए नियमित स्वास्थ्य और चिकित्सा जांच के साथ परिसर में चिकित्सा सुविधा।",
  "Safe, punctual school transport fleet covering Muzaffarpur town and nearby areas.": "मुजफ्फरपुर शहर और आसपास के क्षेत्रों के लिए सुरक्षित, समयबद्ध विद्यालय परिवहन बेड़ा।",
  "Kindergarten Wing": "किंडरगार्टन विंग",
  "A dedicated, colourful kindergarten block designed for our youngest learners at Nursery–UKG.": "सबसे छोटे शिक्षार्थियों के लिए समर्पित रंगीन किंडरगार्टन ब्लॉक।",
  "Cultural Exchange": "सांस्कृतिक आदान-प्रदान",
  "Cultural exchange programmes connecting students with peers across the school chain.": "विद्यार्थियों को विद्यालय श्रृंखला में साथियों से जोड़ने वाले सांस्कृतिक आदान-प्रदान कार्यक्रम।",
  "Symposium & Seminars": "संगोष्ठी और सेमिनार",
  "Regular seminars, science exhibitions, youth parliament and workshops beyond the textbook.": "पाठ्यपुस्तक से परे नियमित संगोष्ठियां, विज्ञान प्रदर्शनी, युवा संसद और कार्यशालाएं।",

  // ═══ COMMON / MISC ═══
  "Yes": "हाँ",
  "No": "नहीं",
  "Loading…": "लोड हो रहा है…",
  "Loading": "लोड हो रहा है",
  "Error": "त्रुटि",
  "Submit": "जमा करें",
  "Cancel": "रद्द करें",
  "Save": "सहेजें",
  "Edit": "संपादित करें",
  "Delete": "हटाएं",
  "Close": "बंद करें",
  "Previous": "पिछला",
  "Next": "अगला",
  "Back to top": "ऊपर जाएं",
  "Chat on WhatsApp": "WhatsApp पर चैट करें",

  // ═══ TESTIMONIAL QUOTES (long-form) ═══
  "St. Xavier's didn't just prepare me for the boards — it made me curious. The teachers knew me by name, knew my weak spots, and refused to let me settle for less. Scoring 97.2% in AISSCE 2026 was only possible because of the after-class doubt sessions and the constant push to aim higher.": "सेंट ज़ेवियर्स ने मुझे केवल बोर्ड के लिए तैयार नहीं किया — इसने मुझे जिज्ञासु बनाया। शिक्षक मुझे नाम से जानते थे, मेरी कमज़ोरियाँ जानते थे, और कम पर समझौता करने नहीं देते थे। AISSCE 2026 में 97.2% अंक केवल कक्षा के बाद के संदेह-समाधान सत्रों और ऊपर उठने के निरंतर प्रोत्साहन के कारण संभव हुए।",
  "We chose Xavier's for the CBSE affiliation and stayed for the people. The transport is punctual, the teachers respond within hours, and the campus with its swimming pool and auditorium feels genuinely world-class for Muzaffarpur.": "हमने सीबीएसई संबद्धता के लिए ज़ेवियर्स चुना और लोगों के लिए रुक गए। परिवहन समयबद्ध है, शिक्षक कुछ ही घंटों में जवाब देते हैं, और अपने स्विमिंग पूल और सभागार के साथ परिसर मुजफ्फरपुर के लिए वास्तव में विश्व-स्तरीय लगता है।",
  "What stays with me isn't just the science coaching — it's the morning assemblies, the value-education classes, the way our Principal ma'am makes sure every girl feels heard. The 100% result this year was a team effort between students and teachers.": "मेरे साथ वह रहता है जो केवल विज्ञान का कोचिंग नहीं है — यह सुबह की सभाएँ, मूल्य-शिक्षा की कक्षाएँ, जिस तरह हमारी प्रधानाचार्य जी सुनिश्चित करती हैं कि हर लड़की की बात सुनी जाए। इस वर्ष 100% परिणाम विद्यार्थियों और शिक्षकों के बीच टीम प्रयास था।",
  "The well-equipped labs at Xavier's made physics and chemistry feel real, not theoretical. When I reached engineering college, I realised how far ahead I was thanks to the hands-on lab culture here. Discipline was drilled into us — and that discipline is what got me through JEE.": "ज़ेवियर्स में सुसज्जित प्रयोगशालाओं ने भौतिकी और रसायन को वास्तविक बना दिया, सैद्धांतिक नहीं। जब मैं इंजीनियरिंग कॉलेज पहुँचा, तो मुझे एहसास हुआ कि यहाँ की व्यावहारिक प्रयोगशाला संस्कृति के कारण मैं कितना आगे था। हमें अनुशासन में ढाला गया — और वही अनुशासन मुझे JEE में सफल बनाया।",
  "The Commerce stream at Xavier's was rigorous but never rigid. We did mock stock-market projects, visited local industries, and our Accounts sir refused to let us memorise — he made us understand. That foundation is why I cleared CA Foundation in my first attempt.": "ज़ेवियर्स में वाणिज्य संकाय कठोर था लेकिन कभी कठोर नहीं। हमने मॉक शेयर-बाज़ार परियोजनाएँ कीं, स्थानीय उद्योगों का दौरा किया, और हमारे अकाउंट्स सर ने हमें रटने नहीं दिया — उन्होंने हमें समझाया। वही नींव कारण है कि मैंने पहले प्रयास में CA फाउंडेशन पास किया।",

  // ═══ MORE UI STRINGS ═══
  "Photo Gallery": "फ़ोटो गैलरी",
  "General": "सामान्य",
  "Laboratory": "प्रयोगशाला",
  "Examination": "परीक्षा",
  "One Time": "एकमुश्त",
  "Yearly": "वार्षिक",
  "Quarterly": "त्रैमासिक",
  "Monthly": "मासिक",
  "Free": "निःशुल्क",
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
  "Email Us": "हमें ईमेल करें",
  "Follow": "फ़ॉलो करें",
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

  // ═══ Round 2 additions — strings found in re-audit ═══
  "Follow us": "हमें फ़ॉलो करें",
  "No photos in this category yet. Check back soon!": "इस श्रेणी में अभी कोई फ़ोटो नहीं हैं। जल्द ही वापस जाँचें!",
  "Where Discipline Meets Opportunity.": "जहाँ अनुशासन मिलता है अवसर से।",
  "Jr./Sr. School • Muzaffarpur": "Jr./Sr. School • मुजफ्फरपुर",
  "ESTABLISHED 1976 • NEARLY FIVE DECADES OF LEGACY": "स्थापित 1976 • लगभग पाँच दशकों की विरासत",

  // ═══ Round 12: ADMIN PAGE translations (staff-only but user wants everything) ═══
  "St. Xavier's Admin": "St. Xavier's व्यवस्थापक",
  "Admin Access": "व्यवस्थापक पहुँच",
  "Admin Code": "व्यवस्थापक कोड",
  "Enter the admin code": "व्यवस्थापक कोड दर्ज करें",
  "Verifying…": "सत्यापित किया जा रहा है…",
  "Authorized personnel only. All access is logged.": "केवल अधिकृत कर्मचारी। सभी पहुँच दर्ज की जाती है।",
  "Welcome back, Admin": "वापसी पर स्वागत है, व्यवस्थापक",
  "Here's what's happening at St. Xavier's today.": "आज St. Xavier's में यह हो रहा है।",
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

  // ═══ Public-facing strings still in English ═══
  "Skip to content": "सामग्री पर जाएं",
  "St. Xavier's Jr./Sr. School, Muzaffarpur": "St. Xavier's Jr./Sr. School, मुजफ्फरपुर",
  "St. Xavier's Jr./Sr. School • Muzaffarpur": "St. Xavier's Jr./Sr. School • मुजफ्फरपुर",
  "St. Xavier's Jr./Sr. School, Muzaffarpur — campus view": "St. Xavier's Jr./Sr. School, मुजफ्फरपुर — परिसर दृश्य",
  "Central Board of Secondary Education (CBSE)": "केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE)",

  // ═══ Admin stats labels ═══
  "Active notices": "सक्रिय सूचनाएँ",
  "Active FAQs": "सक्रिय प्रश्न",
  "This week": "इस सप्ताह",
  "All time": "सभी समय",

  // ═══ More admin strings ═══
  "Subject": "विषय",
  "Day": "दिन",
  "Period": "अवधि",
  "Start Time": "प्रारंभ समय",
  "End Time": "समाप्ति समय",
  "Class Grade": "कक्षा",
  "Teacher": "शिक्षक",
  "Room": "कक्ष",
  "Amount": "राशि",
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

  // ═══ Round 12 part 2: Admin strings with different quote styles ═══
  "Read": "पढ़ें",
  "Unread": "अपठित",
  "Mark as read": "पढ़ा हुआ चिह्नित करें",
  "Mark as unread": "अपठित चिह्नित करें",

  // ═══ Round 13: Admin empty states with curly quotes (from &ldquo; &rdquo;) ═══
  "No fee rows yet. Click “Add Fee Row” to begin.": "अभी तक कोई शुल्क पंक्ति नहीं। शुरू करने के लिए “शुल्क पंक्ति जोड़ें” पर क्लिक करें।",
  "No timetable entries yet. Click “Add Entry” to create the first one.": "अभी तक कोई समय सारिणी प्रविष्टि नहीं। पहली बनाने के लिए “प्रविष्टि जोड़ें” पर क्लिक करें।",

  // ═══ New pages (Part 3) ═══
  "Achievements": "उपलब्धियाँ",
  "Faculty": "संकाय",
  "Notice Board": "सूचना पट्ट",
  "Alumni": "पूर्व छात्र",
  "More": "और",
  "EXcellence IN ACTION": "कर्म में उत्कृष्टता",
  "EXcellence in action": "कर्म में उत्कृष्टता",
  "Our Achievements": "हमारी उपलब्धियाँ",
  "Nearly five decades of academic excellence, sporting triumphs, and all-round achievement. Here's what our students have accomplished.": "लगभग पाँच दशकों की शैक्षणिक उत्कृष्टता, खेल विजय, और सर्वांगीण उपलब्धि। हमारे विद्यार्थियों ने यह हासिल किया है।",
  "AISSCE Toppers — Year-wise": "AISSCE टॉपर — वर्षानुसार",
  "Class 12 board examination toppers over the years": "वर्षों में कक्षा 12 बोर्ड परीक्षा टॉपर",
  "Sports Achievements": "खेल उपलब्धियाँ",
  "Victories at district, state, and inter-school levels": "ज़िला, राज्य और अंतर-विद्यालय स्तर पर विजय",
  "Olympiad Results": "ओलंपियाड परिणाम",
  "National and international academic olympiad achievements": "राष्ट्रीय और अंतर्राष्ट्रीय शैक्षणिक ओलंपियाड उपलब्धियाँ",
  "More to Celebrate": "और भी बहुत कुछ",
  "School Topper": "विद्यालय टॉपर",
  "Commerce Topper": "वाणिज्य टॉपर",
  "PCB Topper": "PCB टॉपर",
  "Science Topper": "विज्ञान टॉपर",

  // Faculty
  "MEET OUR EDUCATORS": "हमारे शिक्षकों से मिलें",
  "Meet our educators": "हमारे शिक्षकों से मिलें",
  "71+ dedicated teachers across 8 departments — the heart and soul of St. Xavier's. Every child is seen, heard, and challenged to become their best.": "8 विभागों में 71+ समर्पित शिक्षक — St. Xavier's के हृदय और आत्मा। हर बच्चे को देखा, सुना और उसे सर्वश्रेष्ठ बनने के लिए चुनौती दी जाती है।",
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
  "Science": "विज्ञान",
  "Mathematics": "गणित",
  "English": "अंग्रेज़ी",
  "Hindi & Sanskrit": "हिंदी और संस्कृत",
  "Social Science": "सामाजिक विज्ञान",
  "Commerce": "वाणिज्य",
  "Computer Science": "कंप्यूटर विज्ञान",
  "Arts & Music": "कला और संगीत",
  "This is a representative directory. For the complete and current faculty list, please contact the school office.": "यह एक प्रतिनिधि निर्देशिका है। संपूर्ण और वर्तमान संकाय सूची के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",

  // Notice Board
  "STAY UPDATED": "अपडेट रहें",
  "School circulars, holiday notices, exam dates, and important announcements. Check back regularly for updates.": "विद्यालय परिपत्र, अवकाश सूचनाएँ, परीक्षा तिथियाँ, और महत्वपूर्ण घोषणाएँ। अपडेट के लिए नियमित रूप से जाँचें।",
  "Important": "महत्वपूर्ण",
  "Exam": "परीक्षा",
  "Holiday": "अवकाश",
  "Event": "कार्यक्रम",
  "Circular": "परिपत्र",
  "For older notices or specific circulars, please contact the school office.": "पुरानी सूचनाओं या विशिष्ट परिपत्रों के लिए कृपया विद्यालय कार्यालय से संपर्क करें।",
  "Notices are updated regularly — bookmark this page.": "सूचनाएँ नियमित रूप से अद्यतन होती हैं — इस पृष्ठ को बुकमार्क करें।",

  // Alumni
  "OUR EXTENDED FAMILY": "हमारा विस्तारित परिवार",
  "Our extended family": "हमारा विस्तारित परिवार",
  "Nearly five decades of Xavierites — making their mark across India and the world. Once a Xavierite, always a Xavierite.": "लगभग पाँच दशकों के Xavierites — भारत और दुनिया भर में अपनी छाप छोड़ रहे हैं। एक बार Xavierite, हमेशा Xavierite।",
  "Alumni by the Decade": "दशकानुसार पूर्व छात्र",
  "Founding decade": "संस्थापक दशक",
  "Growing legacy": "बढ़ती विरासत",
  "Expansion era": "विस्तार युग",
  "Modern era": "आधुनिक युग",
  "Current generation": "वर्तमान पीढ़ी",
  "Where Are They Now?": "वे अब कहाँ हैं?",
  "Stories from Xavierites across the decades": "दशकों में Xavierites की कहानियाँ",
  "Are you a Xavierite?": "क्या आप एक Xavierite हैं?",
  "We'd love to hear from you. Share your story, reconnect with classmates, and mentor current students.": "हम आपसे सुनना चाहेंगे। अपनी कहानी साझा करें, सहपाठियों से फिर से जुड़ें, और वर्तमान विद्यार्थियों का मार्गदर्शन करें।",
  "Batch of": "बैच",

  // Privacy & Terms
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

  // Offline page
  "You're Offline": "आप ऑफ़लाइन हैं",
  "Try Again": "पुनः प्रयास करें",
  "Need to reach us urgently?": "हमसे तत्काल संपर्क करना है?",

  // Sticky apply bar
  "Call school": "विद्यालय को कॉल करें",


  // ═══ Round FINAL: Translate EVERY remaining English string ═══

  // ─── UI strings ───
  "(optional)": "(वैकल्पिक)",
  "Network": "नेटवर्क",
  "Tap to retry": "पुनः प्रयास करने के लिए टैप करें",
  "Couldn't load FAQs.": "प्रश्न लोड नहीं हो सके।",
  "Couldn't load the fee structure.": "शुल्क संरचना लोड नहीं हो सकी।",
  "Couldn't load the timetable.": "समय सारिणी लोड नहीं हो सकी।",

  // ─── Faculty experience strings ───
  "years": "वर्ष",
  "2 years": "2 वर्ष",
  "4 years": "4 वर्ष",
  "5 years": "5 वर्ष",
  "6 years": "6 वर्ष",
  "7 years": "7 वर्ष",
  "8 years": "8 वर्ष",
  "9 years": "9 वर्ष",
  "10 years": "10 वर्ष",
  "11 years": "11 वर्ष",
  "12 years": "12 वर्ष",
  "13 years": "13 वर्ष",
  "14 years": "14 वर्ष",
  "15 years": "15 वर्ष",
  "16 years": "16 वर्ष",
  "18 years": "18 वर्ष",
  "19 years": "19 वर्ष",
  "20 years": "20 वर्ष",
  "22 years": "22 वर्ष",
  "25 years": "25 वर्ष",

  // ─── Faculty qualifications (translate subject, keep degree abbreviation) ───
  "M.Sc., Ph.D. (Physics) — 18 years": "M.Sc., Ph.D. (भौतिकी) — 18 वर्ष",
  "M.Sc. (Chemistry)": "M.Sc. (रसायन)",
  "M.Sc. (Biology)": "M.Sc. (जीव विज्ञान)",
  "M.Sc. (Physics)": "M.Sc. (भौतिकी)",
  "M.Sc. (Maths)": "M.Sc. (गणित)",
  "M.Sc. (Maths) — 20 years": "M.Sc. (गणित) — 20 वर्ष",
  "M.A. (English)": "M.A. (अंग्रेज़ी)",
  "M.A. (English), B.Ed. — 22 years": "M.A. (अंग्रेज़ी), B.Ed. — 22 वर्ष",
  "M.A. (Hindi)": "M.A. (हिंदी)",
  "M.A. (Hindi), Ph.D. — 25 years": "M.A. (हिंदी), Ph.D. — 25 वर्ष",
  "M.A. (History), B.Ed. — 16 years": "M.A. (इतिहास), B.Ed. — 16 वर्ष",
  "M.A. (Geography)": "M.A. (भूगोल)",
  "M.A. (Pol. Sci.)": "M.A. (राजनीति विज्ञान)",
  "M.A. (Sanskrit)": "M.A. (संस्कृत)",
  "M.A. (Music)": "M.A. (संगीत)",
  "M.Com.": "M.Com.",
  "M.Com., B.Ed. — 19 years": "M.Com., B.Ed. — 19 वर्ष",
  "MBA, M.Com.": "MBA, M.Com.",
  "MCA": "MCA",
  "MCA, M.Tech. — 12 years": "MCA, M.Tech. — 12 वर्ष",
  "MFA (Visual Arts) — 14 years": "MFA (दृश्य कला) — 14 वर्ष",
  "B.Tech. (CS)": "B.Tech. (CS)",
  "BFA": "BFA",

  // ─── Achievements page ───
  "100% AISSCE Result": "100% AISSCE परिणाम",
  "80+ Awards": "80+ पुरस्कार",
  "Consistent 100% pass rate in Class 12 board exams for the last 5 years.": "पिछले 5 वर्षों से कक्षा 12 बोर्ड परीक्षा में निरंतर 100% उत्तीर्ण दर।",
  "Over 80 awards won across academics, sports, and cultural competitions since 1976.": "1976 से शैक्षणिक, खेल और सांस्कृतिक प्रतियोगिताओं में 80 से अधिक पुरस्कार जीते।",
  "Winners at the district-level Youth Parliament competition for 3 consecutive years.": "लगातार 3 वर्षों तक ज़िला स्तरीय युवा संसद प्रतियोगिता में विजेता।",
  "Multiple state-level science exhibition qualifiers and winners.": "एकाधिक राज्य स्तरीय विज्ञान प्रदर्शनी के चयनित और विजेता।",
  "Science Exhibition": "विज्ञान प्रदर्शनी",
  "Youth Parliament": "युवा संसद",
  "Gold Medal — U-16 Boys": "स्वर्ण पदक — U-16 लड़के",
  "Silver Medal — 100m Sprint": "रजत पदक — 100 मीटर दौड़",
  "Gold Medal — U-16 Girls": "स्वर्ण पदक — U-16 लड़कियाँ",
  "Bronze Medal — U-14 Girls": "कांस्य पदक — U-14 लड़कियाँ",
  "Quarter-Finalist": "क्वार्टर फाइनलिस्ट",
  "Runner-Up": "उप विजेता",
  "School Team": "विद्यालय टीम",
  "Level 1": "स्तर 1",
  "Level 2": "स्तर 2",
  "3 students in top 1% nationally": "3 विद्यार्थी राष्ट्रीय स्तर पर शीर्ष 1% में",
  "5 Gold medals, 12 students qualified Level 2": "5 स्वर्ण पदक, 12 विद्यार्थी स्तर 2 के लिए चयनित",
  "2 students in state top 10": "2 विद्यार्थी राज्य के शीर्ष 10 में",
  "School rank 1 achieved by 4 students": "4 विद्यार्थियों द्वारा विद्यालय रैंक 1 हासिल की",

  // ─── Notice Board content ───
  "Admissions Open for Academic Session 2026-27": "शैक्षणिक सत्र 2026-27 के लिए प्रवेश खुले हैं",
  "Admissions are now open for Nursery to Class 11 for the academic session 2026-27. Registration forms available at the school office. Limited seats — apply early!": "शैक्षणिक सत्र 2026-27 के लिए नर्सरी से कक्षा 11 तक प्रवेश खुले हैं। पंजीकरण फ़ॉर्म विद्यालय कार्यालय में उपलब्ध। सीमित सीटें — जल्दी आवेदन करें!",
  "AISSCE 2026 Result Declared — 100% Pass": "AISSCE 2026 परिणाम घोषित — 100% उत्तीर्ण",
  "Class 12 board results declared. 100% pass percentage. Krishna Saraf topped with 97.2%. Congratulations to all students and teachers!": "कक्षा 12 बोर्ड परिणाम घोषित। 100% उत्तीर्ण प्रतिशत। कृष्णा सराफ ने 97.2% के साथ टॉप किया। सभी विद्यार्थियों और शिक्षकों को बधाई!",
  "Summer Vacation Notice": "ग्रीष्मकालीन अवकाश सूचना",
  "School will remain closed for summer vacation from 15th May to 25th June 2026. School reopens on 26th June 2026. Office will remain open 9 AM - 12 PM on weekdays.": "विद्यालय 15 मई से 25 जून 2026 तक ग्रीष्मकालीन अवकाश के लिए बंद रहेगा। विद्यालय 26 जून 2026 को पुनः खुलेगा। कार्यालय सप्ताह के दिनों में सुबह 9 - दोपहर 12 बजे तक खुला रहेगा।",
  "Swimming Pool & Sports Academy Enrolment": "स्विमिंग पूल और खेल अकादमी नामांकन",
  "Swimming pool and Sports Academy enrolment open for new students. Contact the school office for registration and fee details.": "नए विद्यार्थियों के लिए स्विमिंग पूल और खेल अकादमी नामांकन खुला है। पंजीकरण और शुल्क विवरण के लिए विद्यालय कार्यालय से संपर्क करें।",
  "Unit Test 1 Schedule — Classes 6 to 12": "इकाई परीक्षण 1 कार्यक्रम — कक्षा 6 से 12",
  "Unit Test 1 for Classes 6-12 will commence from 15th July 2026. Detailed date sheet available with class teachers. Syllabus uploaded on school portal.": "कक्षा 6-12 के लिए इकाई परीक्षण 1 का आयोजन 15 जुलाई 2026 से शुरू होगा। विस्तृत तिथि-सूची कक्षा शिक्षकों के पास उपलब्ध। पाठ्यक्रम विद्यालय पोर्टल पर अपलोड किया गया।",
  "Parent-Teacher Meeting (PTM)": "अभिभावक-शिक्षक बैठक (PTM)",
  "PTM for all classes scheduled for 10th August 2026, 9:00 AM to 12:00 PM. Parents are requested to attend and collect Unit Test 1 report cards.": "सभी कक्षाओं के लिए PTM 10 अगस्त 2026, सुबह 9:00 से दोपहर 12:00 बजे के लिए निर्धारित। अभिभावकों से उपस्थित होने और इकाई परीक्षण 1 रिपोर्ट कार्ड लेने का अनुरोध है।",
  "Independence Day Celebration": "स्वतंत्रता दिवस समारोह",
  "Independence Day will be celebrated on 15th August 2026. Flag hoisting at 8:00 AM followed by cultural programme. Students to arrive by 7:45 AM in school uniform.": "स्वतंत्रता दिवस 15 अगस्त 2026 को मनाया जाएगा। सुबह 8:00 बजे ध्वजारोहण के बाद सांस्कृतिक कार्यक्रम। विद्यार्थी सुबह 7:45 बजे तक विद्यालय वर्दी में उपस्थित हों।",
  "Diwali Break Notice": "दिवाली अवकाश सूचना",
  "School will remain closed for Diwali break from 20th October to 30th October 2026. School reopens on 31st October 2026.": "विद्यालय 20 अक्टूबर से 30 अक्टूबर 2026 तक दिवाली अवकाश के लिए बंद रहेगा। विद्यालय 31 अक्टूबर 2026 को पुनः खुलेगा।",
  "Annual Day 2026 — Save the Date": "वार्षिकोत्सव 2026 — तिथि सहेजें",
  "Annual Day celebration scheduled for 15th December 2026 at the school auditorium. Cultural performances, prize distribution, and more. Invitations will be sent separately.": "वार्षिकोत्सव समारोह 15 दिसंबर 2026 को विद्यालय सभागार में निर्धारित। सांस्कृतिक प्रस्तुतियाँ, पुरस्कार वितरण, और बहुत कुछ। निमंत्रण अलग से भेजे जाएंगे।",
  "School Transport Route Update": "विद्यालय परिवहन मार्ग अद्यतन",
  "New transport routes added for Sitamarhi and Hajipur. Updated fee structure for new routes available at the school office. Existing routes unchanged.": "सीतामढ़ी और हाजीपुर के लिए नए परिवहन मार्ग जोड़े गए। नए मार्गों के लिए अद्यतन शुल्क संरचना विद्यालय कार्यालय में उपलब्ध। मौजूदा मार्ग अपरिवर्तित।",
  "Winter Timings Effective": "शीतकालीन समय लागू",
  "Winter timings effective from 1st November 2026: Nursery-UKG 9:00 AM - 12:30 PM, Classes 1-12 9:00 AM - 3:00 PM. Office hours 9:00 AM - 2:00 PM.": "1 नवंबर 2026 से शीतकालीन समय लागू: नर्सरी-UKG सुबह 9:00 - दोपहर 12:30, कक्षा 1-12 सुबह 9:00 - दोपहर 3:00। कार्यालय समय सुबह 9:00 - दोपहर 2:00।",
  "Christmas Carnival 2026": "क्रिसमस कार्निवल 2026",
  "Annual Christmas Carnival on 23rd December 2026. Games, food stalls, and cultural programmes. Open to all students and parents. Entry free.": "23 दिसंबर 2026 को वार्षिक क्रिसमस कार्निवल। खेल, खाद्य स्टाल, और सांस्कृतिक कार्यक्रम। सभी विद्यार्थियों और अभिभावकों के लिए खुला। प्रवेश निःशुल्क।",

  // ─── Alumni quotes ───
  "Xavier's gave me the discipline that got me through medical school. The biology labs here were better equipped than my first year of MBBS.": "Xavier's ने मुझे वह अनुशासन दिया जिसने मुझे मेडिकल स्कूल में सफल बनाया। यहाँ की जीव विज्ञान प्रयोगशालाएँ मेरे MBBS के पहले वर्ष से भी बेहतर सुसज्जित थीं।",
  "The computer science faculty at Xavier's was ahead of its time. I still remember the coding workshops in Class 11 — that's where my tech journey began.": "Xavier's में कंप्यूटर विज्ञान संकाय अपने समय से आगे था। मुझे आज भी कक्षा 11 के कोडिंग कार्यशालाएँ याद हैं — वहीं से मेरी तकनीकी यात्रा शुरू हुई।",
  "The values education and youth parliament debates at Xavier's shaped my interest in public service. I owe my civil services career to this school.": "Xavier's में मूल्य शिक्षा और युवा संसद बहसों ने मेरी सार्वजनिक सेवा में रुचि को आकार दिया। मैं अपना सिविल सेवा करियर इस विद्यालय को देता हूँ।",
  "My physics teacher at Xavier's, Mr. Sharma, made me fall in love with the subject. Today I build satellites. That journey started in a Class 9 classroom.": "Xavier's में मेरे भौतिकी शिक्षक, श्री शर्मा ने मुझे इस विषय से प्रेम करने पर मजबूर कर दिया। आज मैं उपग्रह बनाता हूँ। वह यात्रा कक्षा 9 की कक्षा से शुरू हुई थी।",
  "The Commerce stream at Xavier's was rigorous but never rigid. Our Accounts sir refused to let us memorise — he made us understand. That foundation built my career.": "Xavier's में वाणिज्य संकाय कठोर था लेकिन कभी अकड़ा हुआ नहीं। हमारे अकाउंट्स सर ने हमें रटने नहीं दिया — उन्होंने हमें समझाया। उसी नींव ने मेरा करियर बनाया।",
  "Xavier's believed in all-round development. I was equally encouraged in academics and in art class. Today I'm an architect — both sides of my education matter.": "Xavier's सर्वांगीण विकास में विश्वास करता था। मुझे शिक्षा में भी और कला कक्षा में भी समान प्रोत्साहन मिला। आज मैं एक वास्तुकार हूँ — मेरी शिक्षा के दोनों पहलू मायने रखते हैं।",
  "The discipline drilled into me at Xavier's — assemblies, uniform inspections, punctuality — prepared me for NDA and the Army. I'm forever grateful.": "Xavier's में मुझमें डाला गया अनुशासन — सभाएँ, वर्दी निरीक्षण, समय निष्ठा — ने मुझे NDA और सेना के लिए तैयार किया। मैं हमेशा आभारी रहूँगा।",
  "The debating culture at Xavier's — youth parliament, elocution competitions — gave me the confidence to pursue law. I still use those skills every day in court.": "Xavier's की बहस संस्कृति — युवा संसद, वाक्पटुता प्रतियोगिताएँ — ने मुझे कानून की पढ़ाई करने का आत्मविश्वास दिया। मैं आज भी अदालत में रोज़ उन कौशल का उपयोग करता हूँ।",

  // ─── Alumni page ───
  "Alumni Network": "पूर्व छात्र नेटवर्क",

  // ─── Faculty page ───
  "Faculty Directory": "संकाय निर्देशिका",

  // ─── Privacy Policy content ───
  "When you use our website or contact us, we may collect:": "जब आप हमारी वेबसाइट का उपयोग करते हैं या हमसे संपर्क करते हैं, तो हम निम्न एकत्र कर सकते हैं:",
  "Enquiry Form Data:": "पूछताछ फ़ॉर्म डेटा:",
  "Your name, email address, phone number, child's interested grade, and message — only when you voluntarily submit the contact form.": "आपका नाम, ईमेल पता, फ़ोन नंबर, बच्चे की रुचि वाली कक्षा, और संदेश — केवल जब आप स्वेच्छा से संपर्क फ़ॉर्म सबमिट करते हैं।",
  "Usage Data:": "उपयोग डेटा:",
  "Anonymous analytics data such as pages visited, time spent, and approximate location (city/region only, not precise).": "गुमनाम एनालिटिक्स डेटा जैसे देखे गए पृष्ठ, बिताया गया समय, और अनुमानित स्थान (केवल शहर/क्षेत्र, सटीक नहीं)।",
  "Admin Logs:": "व्यवस्थापक लॉग:",
  "When admin staff log in, we record the IP address and action taken for security audit purposes.": "जब व्यवस्थापक स्टाफ लॉग इन करता है, हम सुरक्षा ऑडिट उद्देश्य के लिए IP पता और की गई कार्रवाई दर्ज करते हैं।",
  "To respond to your admission enquiries and provide information about our school.": "आपकी प्रवेश पूछताछ का उत्तर देने और हमारे विद्यालय के बारे में जानकारी देने के लिए।",
  "To contact you regarding admissions, fees, or school-related matters.": "प्रवेश, शुल्क, या विद्यालय-संबंधित मामलों के बारे में आपसे संपर्क करने के लिए।",
  "To improve our website and services based on anonymous usage analytics.": "गुमनाम उपयोग एनालिटिक्स के आधार पर हमारी वेबसाइट और सेवाओं में सुधार करने के लिए।",
  "To maintain security logs for audit purposes.": "ऑडिट उद्देश्य के लिए सुरक्षा लॉग बनाए रखने के लिए।",
  "We": "हम",
  "never": "कभी नहीं",
  "sell, rent, or share your personal information with third parties for marketing purposes.": "अपनी व्यक्तिगत जानकारी को विपणन उद्देश्यों के लिए तीसरे पक्षों को बेचते, किराए पर देते, या साझा नहीं करते।",
  "Your enquiry data is stored securely on our hosting provider's servers. Access is restricted to authorized school staff only. Admin sessions are protected with signed cookies and rate-limited login. All communications are encrypted via HTTPS.": "आपकी पूछताछ डेटा हमारे होस्टिंग प्रदाता के सर्वर पर सुरक्षित रूप से संग्रहीत है। पहुँच केवल अधिकृत विद्यालय स्टाफ तक सीमित है। व्यवस्थापक सत्र हस्ताक्षरित कुकीज़ और दर-सीमित लॉगिन से सुरक्षित हैं। सभी संचार HTTPS द्वारा एन्क्रिप्टेड हैं।",
  "Enquiry submissions are retained for up to": "पूछताछ सबमिशन अधिकतम",
  "from the date of submission, after which they are automatically deleted. If you become a student/parent at the school, your data may be retained as part of school records per CBSE guidelines.": "तक रखे जाते हैं, जिसके बाद उन्हें स्वचालित रूप से हटा दिया जाता है। यदि आप विद्यालय में विद्यार्थी/अभिभावक बनते हैं, तो आपका डेटा CBSE दिशानिर्देशों के अनुसार विद्यालय रिकॉर्ड के हिस्से के रूप में रखा जा सकता है।",
  "You have the right to:": "आपके अधिकार हैं:",
  "Request a copy of the personal data we hold about you.": "आपके बारे में हमारे पास मौजूद व्यक्तिगत डेटा की प्रति का अनुरोध करें।",
  "Request correction of inaccurate data.": "गलत डेटा के सुधार का अनुरोध करें।",
  "Request deletion of your data (subject to legal requirements).": "अपने डेटा के विलोपन का अनुरोध करें (कानूनी आवश्यकताओं के अधीन)।",
  "Opt out of any communications at any time.": "किसी भी समय किसी भी संचार से बाहर निकलें।",
  "To exercise these rights, email us at": "इन अधिकारों का उपयोग करने के लिए, हमें ईमेल करें",
  "Our website uses essential cookies for functioning (theme preference, language preference, admin session). We do not use third-party advertising cookies. Analytics cookies, if enabled, are anonymous and used solely to improve the site.": "हमारी वेबसाइट कामकाज के लिए आवश्यक कुकीज़ का उपयोग करती है (थीम प्राथमिकता, भाषा प्राथमिकता, व्यवस्थापक सत्र)। हम तीसरे पक्ष के विज्ञापन कुकीज़ का उपयोग नहीं करते। एनालिटिक्स कुकीज़, यदि सक्षम हैं, गुमनाम हैं और केवल साइट को बेहतर बनाने के लिए उपयोग की जाती हैं।",
  "Our website is designed for parents and guardians making admission enquiries. We do not knowingly collect personal information directly from children under 13. All enquiries are submitted by adults.": "हमारी वेबसाइट प्रवेश पूछताछ करने वाले अभिभावकों के लिए डिज़ाइन की गई है। हम जानबूझकर 13 वर्ष से कम आयु के बच्चों से सीधे व्यक्तिगत जानकारी एकत्र नहीं करते। सभी पूछताछ वयस्कों द्वारा सबमिट की जाती हैं।",
  "For any privacy-related questions or requests, please contact:": "गोपनीयता-संबंधित किसी भी प्रश्न या अनुरोध के लिए, कृपया संपर्क करें:",

  // ─── Terms of Use content ───
  "By accessing and using this website, you accept and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our website.": "इस वेबसाइट तक पहुँच और उपयोग करके, आप इन उपयोग की शर्तों से बंधने के लिए स्वीकार और सहमत होते हैं। यदि आप इन शर्तों के किसी भी हिस्से से सहमत नहीं हैं, तो कृपया हमारी वेबसाइट का उपयोग न करें।",
  "You agree to use this website only for lawful purposes. You must not:": "आप इस वेबसाइट का उपयोग केवल वैध उद्देश्यों के लिए करने के लिए सहमत हैं। आपको नहीं करना चाहिए:",
  "Submit false or misleading information via the enquiry form.": "पूछताछ फ़ॉर्म के माध्यम से झूठी या भ्रामक जानकारी सबमिट करें।",
  "Attempt to gain unauthorized access to admin areas or backend systems.": "व्यवस्थापक क्षेत्रों या बैकएंड सिस्टम तक अनधिकृत पहुँच प्राप्त करने का प्रयास करें।",
  "Use automated scripts (bots) to spam the contact form or overwhelm our servers.": "संपर्क फ़ॉर्म को स्पैम करने या हमारे सर्वर को अभिभूत करने के लिए स्वचालित स्क्रिप्ट (बॉट) का उपयोग करें।",
  "Reproduce, copy, or distribute content without permission.": "अनुमति के बिना सामग्री को पुनः प्रस्तुत, कॉपी, या वितरित करें।",
  "All content on this website — including text, images, logos, graphics, and design — is the property of St. Xavier's Jr./Sr. School, Muzaffarpur, unless otherwise stated. You may not reproduce, distribute, or create derivative works without prior written consent.": "इस वेबसाइट की सभी सामग्री — टेक्स्ट, छवियाँ, लोगो, ग्राफिक्स, और डिज़ाइन सहित — St. Xavier's Jr./Sr. School, मुजफ्फरपुर की संपत्ति है, जब तक अन्यथा न कहा गया हो। आप पूर्व लिखित सहमति के बिना पुनः प्रस्तुत, वितरित, या व्युत्पन्न कार्य नहीं बना सकते।",
  "The school name, logo, and brand identity are protected trademarks.": "विद्यालय का नाम, लोगो, और ब्रांड पहचान संरक्षित ट्रेडमार्क हैं।",
  "When you submit the enquiry form, you confirm that the information provided is accurate and complete. You grant us permission to contact you regarding your enquiry using the email or phone number provided. You can withdraw this consent at any time by emailing us.": "जब आप पूछताछ फ़ॉर्म सबमिट करते हैं, आप पुष्टि करते हैं कि दी गई जानकारी सटीक और पूर्ण है। आप हमें दिए गए ईमेल या फ़ोन नंबर का उपयोग करके आपकी पूछताछ के बारे में संपर्क करने की अनुमति देते हैं। आप हमें ईमेल करके किसी भी समय यह सहमति वापस ले सकते हैं।",
  "The fee structure displayed on this website is indicative and may change without notice. For the most current and class-specific fee details, please contact the school office directly. Payment of fees is governed by the school's separate fee policy, available at the school office.": "इस वेबसाइट पर दिखाई गई शुल्क संरचना संकेतक है और बिना सूचना के बदल सकती है। सबसे वर्तमान और कक्षा-विशिष्ट शुल्क विवरण के लिए, कृपया सीधे विद्यालय कार्यालय से संपर्क करें। शुल्क का भुगतान विद्यालय की अलग शुल्क नीति द्वारा शासित है, जो विद्यालय कार्यालय में उपलब्ध है।",
  "Our website may contain links to external sites (Instagram, Facebook, Google Maps). We are not responsible for the content or privacy practices of these third-party sites. We recommend reviewing their terms and privacy policies.": "हमारी वेबसाइट में बाहरी साइटों (Instagram, Facebook, Google Maps) के लिंक हो सकते हैं। हम इन तीसरे पक्ष की साइटों की सामग्री या गोपनीयता प्रथाओं के लिए ज़िम्मेदार नहीं हैं। हम उनकी शर्तों और गोपनीयता नीतियों की समीक्षा करने की सिफारिश करते हैं।",
  "The information on this website is provided in good faith. We make no representations or warranties of any kind regarding completeness, accuracy, or reliability. School policies, schedules, and fee structures may change — always verify with the school office.": "इस वेबसाइट पर जानकारी अच्छे विश्वास में प्रदान की जाती है। हम पूर्णता, सटीकता, या विश्वसनीयता के बारे में किसी प्रकार का कोई प्रतिनिधित्व या वारंटी नहीं करते। विद्यालय नीतियाँ, कार्यक्रम, और शुल्क संरचनाएँ बदल सकती हैं — हमेशा विद्यालय कार्यालय से सत्यापित करें।",
  "St. Xavier's Jr./Sr. School shall not be liable for any direct, indirect, or consequential damages arising from the use of this website or reliance on any information contained herein.": "St. Xavier's Jr./Sr. School इस वेबसाइट के उपयोग या इसमें निहित किसी भी जानकारी पर निर्भरता से उत्पन्न किसी भी प्रत्यक्ष, अप्रत्यक्ष, या परिणामी क्षति के लिए उत्तरदायी नहीं होगा।",
  "We reserve the right to update these Terms of Use at any time. Changes will be posted on this page with an updated revision date. Continued use of the website after changes constitutes acceptance of the new terms.": "हम किसी भी समय इन उपयोग की शर्तों को अपडेट करने का अधिकार सुरक्षित रखते हैं। परिवर्तन इस पृष्ठ पर अद्यतन संशोधन तिथि के साथ पोस्ट किए जाएंगे। परिवर्तन के बाद वेबसाइट का निरंतर उपयोग नई शर्तों की स्वीकृति माना जाएगा।",
  "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts in Muzaffarpur, Bihar.": "इन शर्तों पर भारत के कानूनों का शासन है। कोई भी विवाद मुजफ्फरपुर, बिहार की अदालतों के क्षेत्राधिकार के अधीन होगा।",

  // ─── Offline page ───
  "It looks like you've lost your internet connection. Some content may not be available. Don't worry — once you're back online, the full site will load automatically.": "ऐसा लगता है कि आपका इंटरनेट कनेक्शन टूट गया है। कुछ सामग्री उपलब्ध नहीं हो सकती। चिंता न करें — एक बार ऑनलाइन आने पर, पूरी साइट स्वचालित रूप से लोड हो जाएगी।",

  // ─── More section headings (with numbers) ───
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

  // ─── Misc ───
  "Email:": "ईमेल:",
  "replied": "उत्तर दिया गया",


  // ═══ Round ULTRA: Translate every remaining English word ═══

  // ─── Event/competition names (translate the generic words, keep proper nouns) ───
  "District Swimming Championship": "ज़िला तैराकी चैंपियनशिप",
  "CBSE Cluster Basketball Tournament": "CBSE क्लस्टर बास्केटबॉल टूर्नामेंट",
  "District Athletics Meet": "ज़िला एथलेटिक्स मीट",
  "Inter-School Cricket Tournament": "अंतर-विद्यालय क्रिकेट टूर्नामेंट",
  "State Yoga Championship": "राज्य योगा चैंपियनशिप",
  "District Table Tennis": "ज़िला टेबल टेनिस",
  "National Science Olympiad (NSO)": "राष्ट्रीय विज्ञान ओलंपियाड (NSO)",
  "International Mathematics Olympiad (IMO)": "अंतर्राष्ट्रीय गणित ओलंपियाड (IMO)",
  "English Olympiad (IEO)": "अंग्रेज़ी ओलंपियाड (IEO)",
  "National Cyber Olympiad (NCO)": "राष्ट्रीय साइबर ओलंपियाड (NCO)",

  // ─── Alumni professions ───
  "Cardiologist, AIIMS Delhi": "कार्डियोलॉजिस्ट, AIIMS दिल्ली",
  "Software Engineer, Google Bangalore": "सॉफ़्टवेयर इंजीनियर, Google बैंगलोर",
  "IAS Officer, Bihar Cadre": "IAS अधिकारी, बिहार कैडर",
  "Research Scientist, ISRO": "शोध वैज्ञानिक, ISRO",
  "CA, Founder — Agarwal & Associates": "CA, संस्थापक — Agarwal & Associates",
  "Architect, Mumbai": "वास्तुकार, मुंबई",
  "Lt. Colonel, Indian Army": "ले. कर्नल, भारतीय सेना",
  "Advocate, Patna High Court": "अधिवक्ता, पटना उच्च न्यायालय",

  // ─── Stream names with Science ───
  "Science (PCM)": "विज्ञान (PCM)",
  "Science (PCB)": "विज्ञान (PCB)",

  // ─── Misc ───
  "2+ acres": "2+ एकड़",
  "Chandra Children Welfare Society": "Chandra Children Welfare Society",
  "you@example.com": "आप@उदाहरण.com",
  "📍 Goshala Road, Ramna, Muzaffarpur — 842002 (Bihar)": "📍 गोशाला रोड, रमना, मुजफ्फरपुर — 842002 (बिहार)",

  // ─── Word-level translations (for partial replacement) ───
  // These ensure individual English words inside sentences get translated
  " acres": " एकड़",
  " boys": " लड़के",
  " girls": " लड़कियाँ",
  " medal": " पदक",
  " medals": " पदक",
  " Gold": " स्वर्ण",
  " Silver": " रजत",
  " Bronze": " कांस्य",
  " Champion": " चैंपियन",
  " Championship": " चैंपियनशिप",
  " Tournament": " टूर्नामेंट",
  " Meet": " मीट",
  " Olympiad": " ओलंपियाड",
  " District": " ज़िला",
  " State": " राज्य",
  " National": " राष्ट्रीय",
  " International": " अंतर्राष्ट्रीय",
  " Inter-School": " अंतर-विद्यालय",
  " Engineer": " इंजीनियर",
  " Scientist": " वैज्ञानिक",
  " Officer": " अधिकारी",
  " Architect": " वास्तुकार",
  " Advocate": " अधिवक्ता",
  " Founder": " संस्थापक",
  " Colonel": " कर्नल",
  " Army": " सेना",
  " Cadre": " कैडर",
  " Court": " न्यायालय",
  " High Court": " उच्च न्यायालय",
  " Indian": " भारतीय",
  " Research": " शोध",
  " Software": " सॉफ़्टवेयर",
  " Cardiologist": " कार्डियोलॉजिस्ट",


  // ═══ ROUND ABSOLUTE: Translate EVERY English word — NO EXCEPTIONS ═══
  // Per user command: even names, places, brands, acronyms get Hindi

  // ─── School name (transliterated) ───
  "St. Xavier": "सेंट ज़ेवियर",
  "St. Xavier's": "सेंट ज़ेवियर्स",
  "Xavier": "ज़ेवियर",
  "Xavier's": "ज़ेवियर्स",
  "St. Xavier's Jr./Sr. School": "सेंट ज़ेवियर्स जूनियर/सीनियर विद्यालय",
  "Jr./Sr. School": "जूनियर/सीनियर विद्यालय",
  "St. Xavier's family": "ज़ेवियर्स परिवार",
  "Xavier's family": "ज़ेवियर्स परिवार",
  "the Xavier's edge": "ज़ेवियर्स का लाभ",
  "Xavier's difference": "ज़ेवियर्स का अंतर",
  "the Xavier's": "ज़ेवियर्स",

  // ─── Place names (transliterated) ───
  "Muzaffarpur": "मुजफ्फरपुर",
  "Ramna": "रमना",
  "Bihar": "बिहार",
  "Sitamarhi": "सीतामढ़ी",
  "Hajipur": "हाजीपुर",
  "Patna": "पटना",
  "Delhi": "दिल्ली",
  "Bangalore": "बैंगलोर",
  "Mumbai": "मुंबई",
  "India": "भारत",
  "AIIMS Delhi": "AIIMS दिल्ली",
  "NIT Patna": "NIT पटना",
  "Patna High Court": "पटना उच्च न्यायालय",
  "Bihar Cadre": "बिहार कैडर",
  "Indian Army": "भारतीय सेना",
  "Google Bangalore": "Google बैंगलोर",

  // ─── Brand names (transliterated) ───
  "WhatsApp": "व्हाट्सऐप",
  "Instagram": "इंस्टाग्राम",
  "Facebook": "फ़ेसबुक",
  "Google": "गूगल",
  "Amrit Web Solutions": "अमृत वेब सॉल्यूशंस",

  // ─── Acronyms (expanded + translated) ───
  "CBSE": "सीबीएसई",
  "AISSCE": "AISSCE",
  "AISSE": "AISSE",
  "JEE": "JEE",
  "CA": "CA",
  "NIT": "NIT",
  "IT": "आईटी",
  "CCTV": "सीसीटीवी",
  "PCM": "PCM",
  "PCB": "PCB",
  "NSO": "NSO",
  "IMO": "IMO",
  "IEO": "IEO",
  "NCO": "NCO",
  "PTM": "PTM",
  "NDA": "NDA",
  "GPS": "जीपीएस",

  // ─── Person names (transliterated) ───
  "S. Chandra": "एस. चंद्रा",
  "Amitabh Chandra": "अमिताभ चंद्रा",
  "A.K. Dutta": "ए.के. दत्ता",
  "Asha Kiran Sinha": "आशा किरण सिन्हा",
  "Krishna Saraf": "कृष्णा सराफ",
  "Mr. S. Chandra": "श्री एस. चंद्रा",
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

  // ─── Initials (transliterated) ───
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

  // ─── Organizations ───
  "Agarwal & Associates": "अग्रवाल एंड एसोसिएट्स",
  "AIIMS": "एम्स",
  "ISRO": "इसरो",

  // ─── School board ───
  "New Delhi": "नई दिल्ली",

};

// ═══════════════════════════════════════════════════════════════
// SMART REPLACEMENT ENGINE
// ═══════════════════════════════════════════════════════════════

// Escape regex special characters in a string
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Sort translations by key length DESCENDING — longest first
// This ensures "Apply for Admission" matches before "Apply"
const SORTED_ENTRIES = Object.entries(TRANSLATIONS)
  .sort((a, b) => b[0].length - a[0].length);

// Pre-compile regex for each key (with word boundaries)
// \b doesn't work well with non-ASCII, but our keys are all English so it's fine
const COMPILED_REGEXES: { regex: RegExp; hi: string }[] = SORTED_ENTRIES.map(([en, hi]) => ({
  regex: new RegExp(`(^|[^\\w])${escapeRegex(en)}(?![\\w])`, 'g'),
  hi,
}));

// Translate a single string
function translateString(text: string): string {
  let result = text;
  for (const { regex, hi } of COMPILED_REGEXES) {
    if (!result.match(regex)) continue;
    // Use a replace function that preserves the leading non-word char
    result = result.replace(regex, (match, prefix) => `${prefix}${hi}`);
  }
  return result;
}

// Check if a string contains Devanagari characters (already translated)
function hasDevanagari(str: string): boolean {
  return /[\u0900-\u097F]/.test(str);
}

// ═══════════════════════════════════════════════════════════════
// DOM TRANSLATION
// ═══════════════════════════════════════════════════════════════

// Translate all text nodes under a root element
function translateTextNodes(root: Node) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'input' || tag === 'textarea' || tag === 'noscript') {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.dataset.noTranslate !== undefined) return NodeFilter.FILTER_REJECT;
        const text = node.textContent;
        if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
        // Skip if already translated (contains Devanagari and no Latin letters to translate)
        if (parent.dataset.hiTranslated === 'true') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
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

    // Skip if already has Devanagari (partially translated)
    if (hasDevanagari(trimmed) && !/[a-zA-Z]{3,}/.test(trimmed)) return;

    // Direct full match (fastest path)
    if (TRANSLATIONS[trimmed]) {
      textNode.textContent = TRANSLATIONS[trimmed];
      if (textNode.parentElement) textNode.parentElement.dataset.hiTranslated = 'true';
      return;
    }

    // Partial replacement (for sentences containing translatable phrases)
    const translated = translateString(original);
    if (translated !== original) {
      textNode.textContent = translated;
      if (textNode.parentElement) textNode.parentElement.dataset.hiTranslated = 'true';
    }
  });
}

// Translate attributes (placeholder, aria-label, title, alt)
function translateAttributes(root: Node) {
  const elements = root instanceof Element ? [root] : [];
  if (root.nodeType === Node.DOCUMENT_NODE) {
    elements.push(...Array.from((root as Document).querySelectorAll('*')));
  } else if (root.nodeType === Node.ELEMENT_NODE) {
    elements.push(root as Element);
    elements.push(...Array.from((root as Element).querySelectorAll('*')));
  }

  const attrsToTranslate = ['placeholder', 'aria-label', 'title', 'alt'];

  elements.forEach(el => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.dataset.hiAttrTranslated === 'true') return;
    let changed = false;
    attrsToTranslate.forEach(attr => {
      const val = htmlEl.getAttribute(attr);
      if (!val || hasDevanagari(val)) return;
      const translated = translateString(val);
      if (translated !== val) {
        htmlEl.setAttribute(attr, translated);
        changed = true;
      }
    });
    if (changed) htmlEl.dataset.hiAttrTranslated = 'true';
  });
}

// Full translation pass
function translateAll() {
  translateTextNodes(document.body);
  translateAttributes(document.body);
}

// Reset all translations (remove data attributes so they can be re-translated)
function resetTranslations() {
  document.querySelectorAll('[data-hi-translated], [data-hi-attr-translated]').forEach(el => {
    const htmlEl = el as HTMLElement;
    delete htmlEl.dataset.hiTranslated;
    delete htmlEl.dataset.hiAttrTranslated;
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

    // MutationObserver — catch React re-renders and dynamic content
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

  // Deactivate Hindi mode — reload to restore English
  useEffect(() => {
    if (lang === 'en' && ready) {
      if (document.body.dataset.hiActive === 'true') {
        document.body.dataset.hiActive = 'false';
        resetTranslations();
        window.location.reload();
      }
    }
  }, [lang, ready]);

  return <>{children}</>;
}
