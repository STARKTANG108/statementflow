import React from "react";
import { siteConfig } from "@/config/site.config";

interface SeoSchemaProps {
  name: string;
  description: string;
  urlPath: string;
  faqs: { question: string; answer: string }[];
  isFreeTool?: boolean;
}

export default function SeoSchema({
  name,
  description,
  urlPath,
  faqs,
  isFreeTool = false,
}: SeoSchemaProps) {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    url: `${siteConfig.siteUrl}${urlPath}`,
    offers: {
      "@type": "Offer",
      price: isFreeTool ? "0.00" : "15.00",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "218",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
