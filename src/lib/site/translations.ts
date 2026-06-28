// Bilingual (English / Hindi) UI string catalogue for the St. Xavier's site.
//
// Each key in `en` MUST have a matching key in `hi`. The `t(key)` helper on
// <LanguageProvider> falls back to the English value (and finally to the raw
// key) if a translation is missing, so it is safe to ship partial coverage.

export type Lang = "en" | "hi";

export const translations = {
  en: {
    // ---- Navbar / global ----
    nav_apply_now: "Apply Now",
    nav_admin_login: "Admin Login",

    // ---- Hero ----
    hero_badge_est: "CBSE • Est.",
    hero_subtitle:
      "Where Discipline Meets Opportunity. Nurturing curious minds since 1976, on Goshala Road, Muzaffarpur.",
    hero_cta_primary: "Begin Your Journey",
    hero_cta_secondary: "Explore Campus",
    hero_pill_students: "+ Students",
    hero_scroll: "Scroll",

    // ---- Notice ticker ----
    notice_label: "Notice",

    // ---- About ----
    about_title: "About Our School",
    about_kicker: "OUR LEGACY",

    // ---- Admissions ----
    admissions_title: "Admissions Open for 2026-27",
    admissions_kicker: "ADMISSIONS OPEN • SESSION 2026 – 27",
    admissions_heading: "Four steps to admission.",
    admissions_apply_button: "Apply for Admission",
    admissions_steps_heading: "How to Apply",

    // ---- Notices section ----
    notices_kicker: "LATEST UPDATES",
    notices_title: "Notice Board",
    notices_subtitle:
      "Circulars, holidays, exam schedules and announcements from the school office.",
    notices_view_all: "View All Notices",
    notices_read_more: "Read more",
    notices_show_less: "Show less",
    notices_download: "Download",
    notices_new_badge: "NEW",

    // ---- Contact ----
    contact_title: "Get in Touch",
    contact_kicker: "GET IN TOUCH",
    contact_heading: "Come, see the Xavier's difference.",
    contact_subtitle:
      "Visit us on Goshala Road or send a quick enquiry — we'd love to meet your family.",
    contact_visit_heading: "Visit / Reach Us",
    contact_form_heading: "Send an Enquiry",
    contact_address_label: "Address",
    contact_phone_label: "Phone",
    contact_email_label: "Email",
    contact_follow_us: "Follow us",
    contact_send_btn: "Send Enquiry",
    contact_sending: "Sending…",

    // ---- Admission form ----
    admission_form_title: "Admission Application",
    admission_form_subtitle:
      "Fill in the details below and our admissions office will reach out within 48 hours.",
    admission_form_student_section: "Student Details",
    admission_form_parent_section: "Parent / Guardian Details",
    admission_form_docs_section: "Documents",
    admission_form_student_name: "Student Full Name",
    admission_form_dob: "Date of Birth",
    admission_form_class: "Class Applying For",
    admission_form_class_placeholder: "Select a class",
    admission_form_parent_name: "Parent / Guardian Name",
    admission_form_phone: "Phone Number",
    admission_form_email: "Email Address",
    admission_form_prev_school: "Previous School (optional)",
    admission_form_address: "Residential Address",
    admission_form_aadhaar: "Aadhaar Card",
    admission_form_birth_cert: "Birth Certificate",
    admission_form_photo: "Student Passport Photo",
    admission_form_upload_placeholder: "Choose file…",
    admission_form_submit: "Submit Application",
    admission_form_submitting: "Submitting…",
    admission_form_success_title: "Application Submitted!",
    admission_form_success_desc:
      "Thank you! We'll contact you within 48 hours. For urgent queries, please call our admissions office.",
    admission_form_close: "Close",

    // ---- Footer ----
    footer_credit: "Built by Amrit Web Solutions",
    footer_rights: "All rights reserved.",
  },

  hi: {
    // ---- Navbar / global ----
    nav_apply_now: "अभी आवेदन करें",
    nav_admin_login: "एडमिन लॉगिन",

    // ---- Hero ----
    hero_badge_est: "सीबीएसई • स्थापित",
    hero_subtitle:
      "जहाँ अनुशासन मिलता है अवसर से। 1976 से गोशाला रोड, मुजफ्फरपुर पर जिज्ञासु मन का पोषण।",
    hero_cta_primary: "अपनी यात्रा शुरू करें",
    hero_cta_secondary: "परिसर देखें",
    hero_pill_students: "+ छात्र",
    hero_scroll: "स्क्रॉल",

    // ---- Notice ticker ----
    notice_label: "सूचना",

    // ---- About ----
    about_title: "हमारे विद्यालय के बारे में",
    about_kicker: "हमारी विरासत",

    // ---- Admissions ----
    admissions_title: "2026-27 के लिए प्रवेश खुले हैं",
    admissions_kicker: "प्रवेश खुले हैं • सत्र 2026 – 27",
    admissions_heading: "प्रवेश के चार चरण।",
    admissions_apply_button: "प्रवेश हेतु आवेदन करें",
    admissions_steps_heading: "कैसे आवेदन करें",

    // ---- Notices section ----
    notices_kicker: "नवीनतम अपडेट",
    notices_title: "सूचना पट्ट",
    notices_subtitle:
      "कार्यालय से परिपत्र, अवकाश, परीक्षा कार्यक्रम एवं घोषणाएँ।",
    notices_view_all: "सभी सूचनाएँ देखें",
    notices_read_more: "और पढ़ें",
    notices_show_less: "कम दिखाएँ",
    notices_download: "डाउनलोड",
    notices_new_badge: "नया",

    // ---- Contact ----
    contact_title: "संपर्क करें",
    contact_kicker: "संपर्क में रहें",
    contact_heading: "आइए, ज़ेवियर्स का अंतर देखें।",
    contact_subtitle:
      "गोशाला रोड पर हमसे मिलें या एक त्वरित पूछताछ भेजें — हम आपके परिवार से मिलकर प्रसन्न होंगे।",
    contact_visit_heading: "पधारें / संपर्क करें",
    contact_form_heading: "पूछताछ भेजें",
    contact_address_label: "पता",
    contact_phone_label: "फ़ोन",
    contact_email_label: "ईमेल",
    contact_follow_us: "हमें फ़ॉलो करें",
    contact_send_btn: "पूछताछ भेजें",
    contact_sending: "भेजा जा रहा है…",

    // ---- Admission form ----
    admission_form_title: "प्रवेश आवेदन",
    admission_form_subtitle:
      "नीचे विवरण भरें और हमारा प्रवेश कार्यालय 48 घंटे के भीतर संपर्क करेगा।",
    admission_form_student_section: "छात्र विवरण",
    admission_form_parent_section: "अभिभावक विवरण",
    admission_form_docs_section: "दस्तावेज़",
    admission_form_student_name: "छात्र का पूरा नाम",
    admission_form_dob: "जन्म तिथि",
    admission_form_class: "प्रवेश हेतु कक्षा",
    admission_form_class_placeholder: "एक कक्षा चुनें",
    admission_form_parent_name: "अभिभावक का नाम",
    admission_form_phone: "फ़ोन नंबर",
    admission_form_email: "ईमेल पता",
    admission_form_prev_school: "पिछला विद्यालय (वैकल्पिक)",
    admission_form_address: "घर का पता",
    admission_form_aadhaar: "आधार कार्ड",
    admission_form_birth_cert: "जन्म प्रमाणपत्र",
    admission_form_photo: "छात्र की पासपोर्ट फ़ोटो",
    admission_form_upload_placeholder: "फ़ाइल चुनें…",
    admission_form_submit: "आवेदन जमा करें",
    admission_form_submitting: "जमा हो रहा है…",
    admission_form_success_title: "आवेदन जमा हो गया!",
    admission_form_success_desc:
      "धन्यवाद! हम 48 घंटे के भीतर आपसे संपर्क करेंगे। तत्काल सहायता के लिए कृपया प्रवेश कार्यालय को कॉल करें।",
    admission_form_close: "बंद करें",

    // ---- Footer ----
    footer_credit: "अमृत वेब सॉल्यूशंस द्वारा निर्मित",
    footer_rights: "सर्वाधिकार सुरक्षित।",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];
