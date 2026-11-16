export enum TabsVariant {
  /** ფურცლის ჩანართები ცხრილის ქვეშ, Excel-ის მსგავსად */
  Sheet = "sheet",
}

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: TabsVariant;
  label?: string;
  className?: string;
}
