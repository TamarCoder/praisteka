import { SegmentedControl } from "@/components/ui/SegmentedControl/SegmentedControl";
import { SegmentedSize } from "@/components/ui/SegmentedControl/SegmentedControl.types";
import { Theme } from "@/stores/preferences.store";
import type { ThemeSwitcherProps } from "./ThemeSwitcher.types";

export function ThemeSwitcher({ value, onChange, labels, className }: ThemeSwitcherProps) {
  const items = [
    { value: Theme.Light, label: "☀", ariaLabel: labels.light },
    { value: Theme.Dark, label: "☾", ariaLabel: labels.dark },
  ];

  return (
    <SegmentedControl
      size={SegmentedSize.Sm}
      label={labels.group}
      items={items}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}
