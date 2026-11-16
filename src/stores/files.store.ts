import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Company {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface FileVersion {
  id: string;
  companyId: string;
  /** ცარიელი — ფაილი ფოლდერის გარეშეა */
  folderId?: string;
  fileName: string;
  /** "YYYY-MM-DD" */
  effectiveFrom: string;
}

/** მომხმარებლის მიერ შენახული ვერსია; შიგთავსი IndexedDB-ში (lib/demoFiles.ts) */
interface Snapshot {
  id: string;
  /** FileVersion.id */
  fileId: string;
  /** 1, 2, 3… ფაილის შიგნით */
  n: number;
  /** Date.now() */
  savedAt: number;
  note: string;
}

interface NewVersion {
  companyName: string;
  fileName: string;
  effectiveFrom: string;
  folderId?: string;
}

interface FilesState {
  companies: Company[];
  versions: FileVersion[];
  folders: Folder[];
  addFolder: (name: string) => Folder;
  snapshots: Snapshot[];
  addSnapshot: (fileId: string, note: string) => Snapshot;
  /** კომპანიაც იშლება, თუ მას სხვა ფაილი აღარ აქვს */
  removeVersion: (id: string) => void;
  /** ყველა ფაილი, ფოლდერი და ვერსია */
  clearAll: () => void;
  /** ქმნის კომპანიას, თუ ასეთი სახელით არ არსებობს */
  addVersion: (input: NewVersion) => FileVersion;
}

// დემო: სია localStorage-ში, შიგთავსი IndexedDB-ში (lib/demoFiles.ts)
export const useFilesStore = create<FilesState>()(
  persist(
    (set, get) => ({
      companies: [],
      versions: [],
      folders: [],
      addFolder: (name) => {
        const folder = { id: crypto.randomUUID(), name: name.trim() };
        set({ folders: [...get().folders, folder] });
        return folder;
      },
      snapshots: [],
      addSnapshot: (fileId, note) => {
        const own = get().snapshots.filter((s) => s.fileId === fileId);
        const n = Math.max(0, ...own.map((s) => s.n)) + 1;
        const snapshot = { id: crypto.randomUUID(), fileId, n, savedAt: Date.now(), note: note.trim() };
        set({ snapshots: [...get().snapshots, snapshot] });
        return snapshot;
      },
      clearAll: () => set({ companies: [], folders: [], versions: [], snapshots: [] }),
      removeVersion: (id) => {
        const versions = get().versions.filter((v) => v.id !== id);
        set({
          versions,
          companies: get().companies.filter((c) => versions.some((v) => v.companyId === c.id)),
          snapshots: get().snapshots.filter((s) => s.fileId !== id),
        });
      },
      addVersion: ({ companyName, fileName, effectiveFrom, folderId }) => {
        const { companies, versions } = get();
        const name = companyName.trim();
        const existing = companies.find((c) => c.name.toLowerCase() === name.toLowerCase());
        const company = existing ?? { id: crypto.randomUUID(), name };
        const version = { id: crypto.randomUUID(), companyId: company.id, folderId, fileName, effectiveFrom };
        set({ companies: existing ? companies : [...companies, company], versions: [...versions, version] });
        return version;
      },
    }),
    { name: "praisteka-files", skipHydration: true },
  ),
);
