import type { SheetData } from "./readWorkbook";

// დემო: ფაილის შიგთავსი ბრაუზერის IndexedDB-ში. ბექენდის მიერთებისას ეს ფაილი შეიცვლება.
const DB_NAME = "praisteka-demo";
const DB_VERSION = 2;
const STORE = "sheets";
/** შენახული ვერსიების ასლები (v2) */
const SNAPSHOTS = "snapshots";

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      for (const name of [STORE, SNAPSHOTS]) {
        if (!req.result.objectStoreNames.contains(name)) req.result.createObjectStore(name);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(store: string, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const req = action(db.transaction(store, mode).objectStore(store));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function saveSheets(versionId: string, sheets: SheetData[]) {
  return run(STORE, "readwrite", (store) => store.put(sheets, versionId));
}

export function deleteSheets(versionId: string) {
  return run(STORE, "readwrite", (store) => store.delete(versionId));
}

export function loadSheets(versionId: string) {
  return run<SheetData[] | undefined>(STORE, "readonly", (store) => store.get(versionId));
}

export function saveSnapshot(snapshotId: string, sheets: SheetData[]) {
  return run(SNAPSHOTS, "readwrite", (store) => store.put(sheets, snapshotId));
}

export function loadSnapshot(snapshotId: string) {
  return run<SheetData[] | undefined>(SNAPSHOTS, "readonly", (store) => store.get(snapshotId));
}

export function deleteSnapshot(snapshotId: string) {
  return run(SNAPSHOTS, "readwrite", (store) => store.delete(snapshotId));
}

/** ყველა ფაილის და ვერსიის შიგთავსის წაშლა (პარამეტრები → მონაცემები) */
export async function clearAllSheets() {
  await run(STORE, "readwrite", (s) => s.clear());
  await run(SNAPSHOTS, "readwrite", (s) => s.clear());
}
