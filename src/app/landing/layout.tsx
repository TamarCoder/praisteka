import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME } from "../site";

// page.tsx client კომპონენტია (ენა store-იდან), ამიტომ metadata აქ არის
const title = "პრაისთეკა — შენი Excel ფაილები, ერთი ძებნით";
const description = "აღარ გჭირდება საქაღალდეების გადაქექვა. ატვირთე ფაილები და მოძებნე ყველაფერი ერთ ადგილას.";
const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/landing" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "ka_GE", url: "/landing", title, description, images },
  twitter: { card: "summary_large_image", title, description, images },
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return children;
}
