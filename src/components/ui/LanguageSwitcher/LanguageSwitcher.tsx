import { SegmentedControl } from "@/components/ui/SegmentedControl/SegmentedControl";
import { SegmentedSize } from "@/components/ui/SegmentedControl/SegmentedControl.types";
import { Locale } from "@/i18n/locales";
import type { LanguageSwitcherProps } from "./LanguageSwitcher.types";

const ITEMS = [
  { value: Locale.Ka, label: "ქა", ariaLabel: "ქართული" },
  { value: Locale.En, label: "EN", ariaLabel: "English" },
];

export function LanguageSwitcher({ value, onChange, label, className }: LanguageSwitcherProps) {
  return (
    <SegmentedControl
      size={SegmentedSize.Sm}
      label={label}
      items={ITEMS}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}
