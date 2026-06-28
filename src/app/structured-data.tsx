export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "St. Xavier's Jr./Sr. School",
    "description": "A premier CBSE co-educational institution since 1976 in Muzaffarpur, Bihar.",
    "url": "https://stxaviers.space-z.ai",
    "logo": "https://stxaviers.space-z.ai/school/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Goshala Road, Ramna",
      "addressLocality": "Muzaffarpur",
      "addressRegion": "Bihar",
      "postalCode": "842002",
      "addressCountry": "IN"
    },
    "telephone": "+91-9835061341",
    "email": "helpdesk@stxaviers.org",
    "foundingDate": "1976",
    "areaServed": "Muzaffarpur, Bihar"
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
