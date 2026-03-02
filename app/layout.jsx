import "../src/styles.css";
import { Geologica } from "next/font/google";

const geologica = Geologica({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.busybuddy.toys"),
  title: {
    default: "BusyBuddy.Toys — Premium Montessori Wooden Toys",
    template: "%s | BusyBuddy.Toys",
  },
  description:
    "BusyBuddy.Toys — Premium Montessori wooden toys crafted with thoughtful design. Our website is under construction. Shop our toys on Etsy while we create something even better.",
  keywords: [
    "BusyBuddy",
    "Montessori toys",
    "wooden toys",
    "educational toys",
    "children toys",
    "Etsy shop",
    "handmade toys",
    "sustainable toys",
  ],
  authors: [{ name: "BusyBuddy.Toys" }],
  creator: "BusyBuddy.Toys",
  publisher: "BusyBuddy.Toys",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "https://www.busybuddy.toys/",
      de: "https://www.busybuddy.toys/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["de_DE"],
    url: "https://www.busybuddy.toys/",
    siteName: "BusyBuddy.Toys",
    title: "BusyBuddy.Toys — Premium Montessori Wooden Toys",
    description:
      "Premium Montessori wooden toys crafted with thoughtful design and careful refinement. Shop our toys on Etsy while we create something even better.",
    images: [
      {
        url: "/media/bw_transperrent-01.png",
        width: 1200,
        height: 630,
        alt: "BusyBuddy.Toys Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BusyBuddy.Toys — Premium Montessori Wooden Toys",
    description:
      "Premium Montessori wooden toys crafted with thoughtful design. Shop our toys on Etsy while we create something even better.",
    images: ["/media/bw_transperrent-01.png"],
    creator: "@busybuddy.toys",
  },
  icons: {
    icon: [
      { url: "/media/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/media/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/media/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/media/apple-touch-icon.png", sizes: "180x180" }],
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: "your-verification-code",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BusyBuddy.Toys",
  url: "https://www.busybuddy.toys",
  logo: "https://www.busybuddy.toys/media/bw_transperrent-01.png",
  description:
    "Premium Montessori wooden toys crafted with thoughtful design and careful refinement.",
  sameAs: [
    "https://www.etsy.com/shop/BusyBuddyToysEU",
    "https://www.instagram.com/busybuddy.toys",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: ["English", "German"],
  },
  offers: {
    "@type": "Offer",
    url: "https://www.etsy.com/shop/BusyBuddyToysEU",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BusyBuddy.Toys",
  url: "https://www.busybuddy.toys",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.busybuddy.toys/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  inLanguage: ["en", "de"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geologica.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}


