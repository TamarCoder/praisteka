/** "2026-09-01" → "01.09.2026" */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Date.now() → "YYYY-MM-DD" ადგილობრივი დროით (ფილტრისთვის) */
export function localDay(ms: number) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date.now() → "15.11.2026 21:40" */
export function formatDateTime(ms: number) {
  const d = new Date(ms);
  return `${formatDate(localDay(ms))} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
