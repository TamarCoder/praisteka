import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { SearchGroup } from "@/lib/searchFiles";

export interface SearchResultsProps {
  groups: SearchGroup[];
  /** მონიშნული სტრიქონების key-ები შედარებისთვის */
  picked: string[];
  onTogglePick: (key: string) => void;
  /** სტრიქონზე დაჭერა — ფაილის გახსნა */
  onOpen: (group: SearchGroup) => void;
  t: Dictionary["dashboard"]["globalSearch"];
}
