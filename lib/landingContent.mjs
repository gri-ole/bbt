import { getSanityClient } from "./sanityClient.mjs";

const FALLBACK = {
  assets: {
    backgroundVideo: "/media/busybuddy-bg.webm",
    logoDay: "/media/bw_transperrent-01.png",
    logoNight: "/media/bw_transperrent-02.png",
    etsyIcon: "/media/etsy-logo.png",
    instagramIcon: "/media/instagram-logo.png",
  },
  cta: {
    etsyHref: "https://www.etsy.com/shop/BusyBuddyToysEU",
    instagramHref: "https://www.instagram.com/busybuddy.toys",
  },
  translations: {
    en: {
      title: "We're Building Something Amazing",
      subtitle: "Our website is under construction. We'll be back soon with something special!",
      body: [],
      etsyCta: "Shop on Etsy",
      instagramCta: "Instagram",
      progressLabel: "Construction Progress",
    },
    de: {
      title: "Wir bauen etwas Neues",
      subtitle: "Unsere Website wird gerade überarbeitet. Bald sind wir mit etwas Besonderem zurück.",
      body: [],
      etsyCta: "Unsere Montessori‑Spielzeuge auf Etsy",
      instagramCta: "Instagram",
      progressLabel: "Fortschritt bis zum Launch",
    },
  },
};

// Minimal GROQ: expects a single landingPage doc.
const QUERY = `*[_type == "landingPage"][0]{
  "assets": {
    "backgroundVideo": coalesce(backgroundVideoUrl, "${FALLBACK.assets.backgroundVideo}"),
    "logoDay": coalesce(logoDayUrl, "${FALLBACK.assets.logoDay}"),
    "logoNight": coalesce(logoNightUrl, "${FALLBACK.assets.logoNight}"),
    "etsyIcon": coalesce(etsyIconUrl, "${FALLBACK.assets.etsyIcon}"),
    "instagramIcon": coalesce(instagramIconUrl, "${FALLBACK.assets.instagramIcon}")
  },
  "cta": {
    "etsyHref": coalesce(etsyHref, "${FALLBACK.cta.etsyHref}"),
    "instagramHref": coalesce(instagramHref, "${FALLBACK.cta.instagramHref}")
  },
  "translations": {
    "en": {
      "title": coalesce(titleEn, "${FALLBACK.translations.en.title}"),
      "subtitle": coalesce(subtitleEn, "${FALLBACK.translations.en.subtitle}"),
      "body": coalesce(bodyEn, ${JSON.stringify(FALLBACK.translations.en.body)}),
      "etsyCta": coalesce(etsyCtaEn, "${FALLBACK.translations.en.etsyCta}"),
      "instagramCta": coalesce(instagramCtaEn, "${FALLBACK.translations.en.instagramCta}"),
      "progressLabel": coalesce(progressLabelEn, "${FALLBACK.translations.en.progressLabel}")
    },
    "de": {
      "title": coalesce(titleDe, "${FALLBACK.translations.de.title}"),
      "subtitle": coalesce(subtitleDe, "${FALLBACK.translations.de.subtitle}"),
      "body": coalesce(bodyDe, ${JSON.stringify(FALLBACK.translations.de.body)}),
      "etsyCta": coalesce(etsyCtaDe, "${FALLBACK.translations.de.etsyCta}"),
      "instagramCta": coalesce(instagramCtaDe, "${FALLBACK.translations.de.instagramCta}"),
      "progressLabel": coalesce(progressLabelDe, "${FALLBACK.translations.de.progressLabel}")
    }
  }
}`;

export async function getLandingPageContent() {
  const client = getSanityClient();
  if (!client) return FALLBACK;

  try {
    const data = await client.fetch(QUERY);
    return data || FALLBACK;
  } catch {
    return FALLBACK;
  }
}


