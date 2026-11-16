import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// მხოლოდ ლოგო: ImageResponse-ის ფონტს ქართული ასოები არ აქვს
// ფერები = manifest.ts: paper #f8fafb, acc #1d4f8f
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/icon-512.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafb", color: "#1d4f8f" }}>
        <img src={src} width={360} height={360} alt="" />
      </div>
    ),
    size,
  );
}
