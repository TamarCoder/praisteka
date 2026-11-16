import path from "node:path";
import type { NextConfig } from "next";

// ბრაუზერის დაცვის header-ები ყველა გვერდზე:
// საიტს სხვა საიტი iframe-ში ვერ ჩასვამს (clickjacking), ფაილის ტიპს ბრაუზერი არ „გამოიცნობს“,
// სხვა საიტზე გადასვლისას მისამართის მხოლოდ დომენი იგზავნება, კამერა/მიკროფონი/ლოკაცია — გამორთული
const API_ORIGIN = process.env.API_ORIGIN ?? "https://priceteka-api.onrender.com";

const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // /api/* → Render: ბრაუზერისთვის საიტი და API ერთი დომენია, ამიტომ სესია HttpOnly cookie-შია
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
};

export default nextConfig;
