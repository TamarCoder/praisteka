import type { ReactNode } from "react";

export interface FileHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  searchLabel: string;
  disabled?: boolean;
  /** ღილაკები ძებნის წინ: ისტორია, ფოლდერი, ვერსია, ატვირთვა */
  actions?: ReactNode;
  /** ავატარი: მობილურზე ზედა ზოლში რჩება, დანარჩენი ღილაკები ☰ მენიუში გადადის */
  user?: ReactNode;
  /** ძებნის გვერდით, მაგ. „ამ ფაილში / ყველა ფაილში“ */
  scope?: ReactNode;
}
