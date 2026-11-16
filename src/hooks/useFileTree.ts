"use client";

import type { TreeFile, TreeFolder } from "@/components/FileTree/FileTree.types";
import { formatDate } from "@/lib/formatDate";
import type { Company, FileSummary, Folder } from "@/types/api";

/** ზოლის ხე: ფოლდერები და ფოლდერის გარეშე ფაილები, ახლიდან ძველისკენ */
export function useFileTree(files: FileSummary[], folders: Folder[], companies: Company[]): { folders: TreeFolder[]; files: TreeFile[]; firstId?: string } {
  const sorted = [...files].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));

  const toFile = (f: FileSummary): TreeFile => ({
    id: f.id,
    name: f.fileName,
    meta: `${companies.find((c) => c.id === f.companyId)?.name ?? ""} · ${formatDate(f.effectiveFrom)}`,
  });

  return {
    /** ყველაზე ახალი ფაილი — /dashboard ამას ხსნის, თუ ?file= არ არის */
    firstId: sorted[0]?.id,
    folders: folders.map((f) => ({ id: f.id, name: f.name, files: sorted.filter((v) => v.folderId === f.id).map(toFile) })),
    files: sorted.filter((v) => !v.folderId || !folders.some((f) => f.id === v.folderId)).map(toFile),
  };
}
