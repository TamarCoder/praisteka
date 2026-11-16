import type { ReactNode } from "react";

interface SnapshotItem {
  id: string;
  /** მაგ. „ნიუ ვიჟენი 2026.xlsx · ვერსია 2“ */
  title: string;
  /** თარიღი და დრო */
  meta: string;
  note: string;
  latest: boolean;
}

export interface SnapshotListProps {
  label: string;
  items: SnapshotItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  latestLabel: string;
  /** როცა სია ცარიელია — მაგ. EmptyState */
  empty: ReactNode;
}
