import type { SheetData } from "./sheetData";

// ტიპები და trimSheet — sheetData.ts-ში; აქაც ხელმისაწვდომია, რომ ძველი import-ები არ შეიცვალოს
export { maxLength, trimSheet, type CellValue, type SheetData } from "./sheetData";

type WorkerReply = { ok: true; sheets: SheetData[] } | { ok: false; error: string };

/** ფაილი მუშავდება ცალკე ნაკადში; Worker-ის გარეშე (ძველი ბრაუზერი) — აქვე */
export async function readWorkbook(file: File): Promise<SheetData[]> {
  const data = await file.arrayBuffer();
  if (typeof Worker === "undefined") return (await import("./parseWorkbook")).parseWorkbook(data);
  const worker = new Worker(new URL("./readWorkbook.worker.ts", import.meta.url), { type: "module" });
  try {
    const reply = await new Promise<WorkerReply>((resolve, reject) => {
      worker.onmessage = (e: MessageEvent<WorkerReply>) => resolve(e.data);
      worker.onerror = (e) => reject(new Error(e.message || "worker failed"));
      worker.postMessage(data, [data]);
    });
    if (!reply.ok) throw new Error(reply.error);
    return reply.sheets;
  } finally {
    worker.terminate();
  }
}
