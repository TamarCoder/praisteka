"use client";

import type { TreeFile, TreeFolder } from "@/components/FileTree/FileTree.types";
import { formatDate } from "@/lib/formatDate";
import type { Company, FileSummary, Folder } from "@/types/api";

/**
 * ზოლის ხე: ხელით შექმნილი ფოლდერები, შემდეგ დანარჩენი ფაილები კომპანიით დაჯგუფებული —
 * ერთი პრაისის ყველა ვერსია ერთად, ახლიდან ძველისკენ
 */
export function useFileTree(files: FileSummary[], folders: Folder[], companies: Company[]): { folders: TreeFolder[]; files: TreeFile[] } {
  const sorted = [...files].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "";
  const toFile = (f: FileSummary, withCompany = true): TreeFile => ({
    id: f.id,
    name: f.fileName,
    meta: withCompany ? `${companyName(f.companyId)} · ${formatDate(f.effectiveFrom)}` : formatDate(f.effectiveFrom),
  });

  const loose = sorted.filter((v) => !v.folderId || !folders.some((f) => f.id === v.folderId));
  const companyIds = [...new Set(loose.map((v) => v.companyId))];
  return {
    folders: [
      ...folders.map((f) => ({ id: f.id, name: f.name, files: sorted.filter((v) => v.folderId === f.id).map((v) => toFile(v)) })),
      ...companyIds.map((id) => ({ id: `company:${id}`, name: companyName(id), files: loose.filter((v) => v.companyId === id).map((v) => toFile(v, false)) })),
    ],
    files: [],
  };
}
