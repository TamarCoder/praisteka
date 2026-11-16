"use client";

import type { TreeFile, TreeFolder } from "@/components/FileTree/FileTree.types";
import { formatDate } from "@/lib/formatDate";
import { useFilesStore, type FileVersion } from "@/stores/files.store";

/** ზოლის ხე: ფოლდერები და ფოლდერის გარეშე ფაილები, ახლიდან ძველისკენ */
export function useFileTree(): { folders: TreeFolder[]; files: TreeFile[]; firstId?: string } {
  const { companies, versions, folders } = useFilesStore();
  const sorted = [...versions].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));

  const toFile = (v: FileVersion): TreeFile => ({
    id: v.id,
    name: v.fileName,
    meta: `${companies.find((c) => c.id === v.companyId)?.name ?? ""} · ${formatDate(v.effectiveFrom)}`,
  });

  return {
    /** ყველაზე ახალი ფაილი — /dashboard ამას ხსნის, თუ ?file= არ არის */
    firstId: sorted[0]?.id,
    folders: folders.map((f) => ({ id: f.id, name: f.name, files: sorted.filter((v) => v.folderId === f.id).map(toFile) })),
    files: sorted.filter((v) => !v.folderId || !folders.some((f) => f.id === v.folderId)).map(toFile),
  };
}
