import type { MetadataRoute } from "next";

// ფერები = _colors.scss: paper #f8fafb, ზოლი = bg #dfe5ea (layout.tsx viewport)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "პრაისთეკა",
    short_name: "პრაისთეკა",
    description: "შენი Excel ფაილები ერთ ადგილას, ერთი ძებნით",
    lang: "ka",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafb",
    theme_color: "#dfe5ea",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
