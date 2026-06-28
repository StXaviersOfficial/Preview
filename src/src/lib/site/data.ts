// Centralised site data so every component reads from one source of truth.
// ALL DATA VERIFIED from public sources:
//  - creativityadda.com (school's official mirror site with principal's message, leadership, fees)
//  - careers360.com school page (gallery images, school info, facilities, fee structure)
//  - Instagram @stxavierjrsrschool (verified contact details, latest achievements)
//  - schoolmykids.com (location, board affiliation)
//  - Scribd academic calendar 2025-26 (address, email)

export const SCHOOL = {
  name: "St. Xavier's Jr./Sr. School",
  shortName: "St. Xavier's",
  city: "Muzaffarpur",
  state: "Bihar",
  pincode: "842002",
  addressLine: "Goshala Road, Ramna, Muzaffarpur — 842002 (Bihar)",
  established: 1976,
  board: "Central Board of Secondary Education (CBSE), New Delhi",
  boardLevel: "up to 10+2 Level",
  type: "Co-Educational English Medium",
  format: "Day-cum-Boarding School",
  classesRange: "Nursery to Std. XII",
  tagline: "Where Discipline Meets Opportunity",
  motto: "Inspiring Excellence, Empowering Success",

  // Verified phone numbers from Instagram & creativityadda
  phones: ["9835061341", "9334257335", "9973356650", "9546375555"],
  email: "helpdesk@stxaviers.org",
  emailAlt: "info@stxaviers.com",
  website: "www.stxaviers.org",
  instagram: "https://www.instagram.com/stxavierjrsrschool/",
  facebook: "https://www.facebook.com/StXaviersSchoolMuzaffarpur",

  // Verified — from Instagram bio
  rank: "#1 Ranked School in Muzaffarpur",

  // Verified — from careers360
  managingSociety: "Chandra Children Welfare Society",
  societyAct: "registered under the Societies Reg. Act. XXI 1860",
  campusArea: "8,094 Sq. Metres (2+ acres)",
  teachersCount: 71, // careers360 lists 71; creativityadda shows 80+ including visiting
  classroomsCount: 48,
  studentsEnrolled: 1222,
  libraryBooks: 6506,
  awards: 80,

  // Verified leadership from creativityadda.com
  leadership: [
    { name: "S. Chandra", role: "Chairman", image: "/school/team-01.jpg" },
    { name: "Amitabh Chandra", role: "Managing Director", image: "/school/team-04.jpg" },
    { name: "A.K. Dutta", role: "Joint Director", image: "/school/team-03.jpg" },
    { name: "Asha Kiran Sinha", role: "Principal", image: "/school/team-05.jpg" },
  ],

  // Verified principal's message excerpt (creativityadda.com/message-principal.php)
  principalMessage: "Education is important for one's success in life. It is essential for an individual's growth. The process of learning and improving one's skills is referred to as education. Wisdom and the ability to handle challenges come with knowledge. Education enhances one's quality of life while also granting social recognition.",
  principalName: "Asha Kiran Sinha",

  // Verified facilities list from careers360
  facilities: {
    sports: ["Swimming Pool", "Sports Academy", "Aerobics", "Yoga Activity", "Indoor Games"],
    infrastructure: ["Hostel", "IT Infrastructure", "Kindergarten", "Library", "Music Rooms", "Gymnasium", "Symposium", "Toilet facilities", "Transport", "Auditorium", "Cafeteria", "Classroom", "Convenience Store", "Dance Rooms"],
    advanced: ["Labs", "Medical Facility", "Security/CCTV", "Health and Medical Check up", "Transfer Facility among school chain", "Cultural Exchange Program"],
    activities: ["Science Exhibition", "Seminars", "Festival Celebrations", "Sports Day", "Youth Parliament", "Summer Camp", "Workshops", "Annual Day/Fest", "Christmas Carnival", "Art & Craft", "Blood Donation Camps"],
  },

  // CBSE Streams offered (verified)
  streams: ["PCM", "PCB", "Commerce", "Arts"],

  // Verified from Instagram post — top scorer
  topScorer: {
    name: "Krishna Saraf",
    score: "97.2%",
    exam: "AISSCE 2026 (Class 12)",
    rollNo: "M01",
  },

  mapQuery: "St. Xavier's Jr Sr School, Goshala Road, Ramna, Muzaffarpur, Bihar 842002",
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Campus", href: "#campus" },
  { label: "Gallery", href: "#gallery" },
  { label: "Timetable", href: "#timetable" },
  { label: "Fees", href: "#fees" },
  { label: "Admissions", href: "#admissions" },
  { label: "Contact", href: "#contact" },
];

export const STATS = [
  { value: SCHOOL.established, suffix: "", label: "Year of Establishment", sub: "Nearly five decades of legacy" },
  { value: SCHOOL.studentsEnrolled, suffix: "+", label: "Students Enrolled", sub: "Across Nursery to Class XII" },
  { value: SCHOOL.teachersCount, suffix: "+", label: "Skilled Teachers", sub: "Dedicated & experienced faculty" },
  { value: SCHOOL.libraryBooks, suffix: "+", label: "Library Books", sub: "Reading culture since 1976" },
];

// REAL verified images from the school's own media gallery and creativityadda mirror
export const IMAGES = {
  logo: "/school/logo.png",
  logoWhite: "/school/logo-white.png",
  home: "/school/home.jpg",                 // creativityadda home image
  about1: "/school/about-01.jpg",
  about2: "/school/about-02.jpg",
  about3: "/school/about-03.jpg",
  // Real school media-gallery photos (careers360 cached)
  galleryChristmas: "/school/gallery-christmas.jpg",
  galleryStudents: "/school/gallery-students.jpg",
  galleryDance: "/school/gallery-dance.jpg",
  galleryGroupPhoto: "/school/gallery-groupphoto.jpg",
  galleryIndoor: "/school/gallery-indoor.jpg",
  // Real school photos from creativityadda gallery
  gallery1: "/school/gallery-01.jpg",
  gallery2: "/school/gallery-02.jpg",
  gallery4: "/school/gallery-04.jpg",
  gallery6: "/school/gallery-06.jpg",
  // Leadership photos (real)
  team1: "/school/team-01.jpg",  // S. Chandra, Chairman
  team3: "/school/team-03.jpg",  // A.K. Dutta, Joint Director
  team4: "/school/team-04.jpg",  // Amitabh Chandra, Managing Director
  team5: "/school/team-05.jpg",  // Asha Kiran Sinha, Principal
};
