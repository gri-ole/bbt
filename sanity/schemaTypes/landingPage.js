export default {
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },

    { name: "backgroundVideoUrl", title: "Background video URL", type: "url" },
    { name: "logoDayUrl", title: "Logo (day) URL", type: "url" },
    { name: "logoNightUrl", title: "Logo (night) URL", type: "url" },
    { name: "etsyIconUrl", title: "Etsy icon URL", type: "url" },
    { name: "instagramIconUrl", title: "Instagram icon URL", type: "url" },

    { name: "etsyHref", title: "Etsy link", type: "url" },
    { name: "instagramHref", title: "Instagram link", type: "url" },

    { name: "titleEn", title: "Title (EN)", type: "string" },
    { name: "subtitleEn", title: "Subtitle (EN)", type: "string" },
    { name: "titleDe", title: "Title (DE)", type: "string" },
    { name: "subtitleDe", title: "Subtitle (DE)", type: "string" },
    { name: "bodyEn", title: "Body (EN) paragraphs (optional, below subtitle)", type: "array", of: [{ type: "string" }] },
    { name: "bodyDe", title: "Body (DE) paragraphs (optional, below subtitle)", type: "array", of: [{ type: "string" }] },

    { name: "etsyCtaEn", title: "Etsy CTA (EN)", type: "string" },
    { name: "etsyCtaDe", title: "Etsy CTA (DE)", type: "string" },
    { name: "instagramCtaEn", title: "Instagram CTA (EN)", type: "string" },
    { name: "instagramCtaDe", title: "Instagram CTA (DE)", type: "string" },
    { name: "progressLabelEn", title: "Progress label (EN)", type: "string" },
    { name: "progressLabelDe", title: "Progress label (DE)", type: "string" },
  ],
};


