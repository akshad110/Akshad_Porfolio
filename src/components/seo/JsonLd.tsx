import { site } from "@/data/site";
import { siteUrl } from "@/lib/utils";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: site.name,
        url: siteUrl(),
        description: site.description,
      },
      {
        "@type": "Person",
        name: site.name,
        jobTitle: site.role,
        email: site.email,
        telephone: site.phone,
        url: siteUrl(),
        sameAs: [site.github, site.linkedin, site.leetcode],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Vadodara",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
