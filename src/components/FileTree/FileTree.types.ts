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
  /** ხელით შექმნილი ფოლდერი (კომპანიის ავტომატური ჯგუფი — არა): წაშლა შეიძლება */
  editable?: boolean;
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
  /** ფოლდერში გადატანა; არ არის — ღილაკი არ ჩანს */
  onMove?: (id: string) => void;
  moveLabel?: string;
  /** წაშლის ღილაკის წარწერა ეკრანის წამკითხველისთვის */
  deleteLabel?: string;
  /** ფოლდერის წაშლა (მხოლოდ editable ფოლდერებზე) */
  onDeleteFolder?: (id: string) => void;
  deleteFolderLabel?: string;
  emptyText: string;
  /** ერთი ხაზი სათაურის ქვეშ */
  emptyHint: string;
}
