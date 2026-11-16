export enum SegmentedSize {
  /** h34 — ფორმები (შესვლა/რეგისტრაცია) */
  Md = "md",
  /** h28 · 12px — ზედა ზოლი (ენა, თემა) */
  Sm = "sm",
}

interface SegmentItem<T extends string = string> {
  value: T;
  label: string;
  /** თუ label სიმბოლოა (☀), ეკრანის წამკითხველისთვის */
  ariaLabel?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentItem<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: SegmentedSize;
  disabled?: boolean;
  label?: string;
  className?: string;
}
