import type { ReactNode } from "react";

export interface FileHeaderProps {
  title: string;
  subtitle: string;
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  searchLabel: string;
  disabled?: boolean;
  /** ღილაკები ძებნის წინ: ისტორია, ფოლდერი, ვერსია, ატვირთვა */
  actions?: ReactNode;
  /** ძებნის გვერდით, მაგ. „ამ ფაილში / ყველა ფაილში“ */
  scope?: ReactNode;
}
