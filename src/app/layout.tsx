import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import { PreferencesSync } from "@/components/PreferencesSync/PreferencesSync";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { PREFERENCES_KEY } from "@/stores/preferences.store";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";
import "./globals.scss";

const fontSans = Noto_Sans_Georgian({
  variable: "--font-sans",
  subsets: ["georgian", "latin"],
  weight: ["400", "600"],
});

const fontSerif = Noto_Serif_Georgian({
  variable: "--font-serif",
  subsets: ["georgian", "latin"],
  weight: ["500", "700"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "ka_GE", title: SITE_NAME, description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

// Google-ისთვის: ორგანიზაცია ლოგოთი და საიტი
const jsonLd = JSON.stringify([
  { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon-512.png` },
  { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "ka" },
]).replace(/</g, "\\u003c");

// ბრაუზერის ზოლის ფერი ტელეფონზე = bg (_colors.scss)
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dfe5ea" },
    { media: "(prefers-color-scheme: dark)", color: "#12171d" },
  ],
};

// გვერდის დახატვამდე: შენახული თემა, ენა და ზოლის მდგომარეობა <html>-ზე, რომ არაფერი „აციმციმდეს“
// ძველი სახელის (praisteka-*) გასაღებები ერთხელ გადადის priceteka-*-ში — შესვლა და პარამეტრები არ იკარგება
const preferencesScript = `try{Object.keys(localStorage).forEach(function(k){if(k.indexOf("praisteka-")===0){var n="priceteka-"+k.slice(10);if(localStorage.getItem(n)===null)localStorage.setItem(n,localStorage.getItem(k));localStorage.removeItem(k)}});var s=(JSON.parse(localStorage.getItem(${JSON.stringify(PREFERENCES_KEY)})||"{}").state)||{};var r=document.documentElement;if(s.theme)r.dataset.th=s.theme;if(s.locale)r.lang=s.locale;if(s.sidebarCollapsed)r.dataset.sidebar="collapsed"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </head>
      <body>
        <PreferencesSync />
        {children}
      </body>
    </html>
  );
}
