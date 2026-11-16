import type { TabItem } from "@/components/ui/Tabs/Tabs.types";

export interface SheetFooterProps {
  sheets: TabItem[];
  value: string;
  onChange: (value: string) => void;
  sheetsLabel: string;
  /** „ისრებით გადაადგილება · Ctrl+C კოპირება“ */
  hint: string;
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
}
