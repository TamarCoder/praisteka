export interface TreeFile {
  id: string;
  name: string;
  /** მაგ. „კომპანია · 01.09.2026“ */
  meta: string;
}

export interface TreeFolder {
  id: string;
  name: string;
  files: TreeFile[];
}

export interface FileTreeProps {
  label: string;
  folders: TreeFolder[];
  /** ფოლდერის გარეშე ფაილები */
  files: TreeFile[];
  activeId?: string;
  onSelect: (id: string) => void;
  /** არ არის — წაშლის ღილაკი არ ჩანს */
  onDelete?: (id: string) => void;
  /** წაშლის ღილაკის წარწერა ეკრანის წამკითხველისთვის */
  deleteLabel?: string;
  emptyText: string;
  /** ერთი ხაზი სათაურის ქვეშ */
  emptyHint: string;
}
