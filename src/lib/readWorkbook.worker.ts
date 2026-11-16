// Excel-ის დამუშავება ცალკე ნაკადში — მთავარი გვერდი არ იყინება („Page unresponsive“)
import { parseWorkbook } from "./parseWorkbook";

self.onmessage = async (e: MessageEvent<ArrayBuffer>) => {
  try {
    self.postMessage({ ok: true, sheets: await parseWorkbook(e.data) });
  } catch (error) {
    self.postMessage({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
