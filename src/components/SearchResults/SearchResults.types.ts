import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { SearchGroup } from "@/lib/searchFiles";

export interface SearchResultsProps {
  groups: SearchGroup[];
  /** ჩაწერილი ტექსტი — შეჯამებისთვის */
  query: string;
  /** ფაილები, სადაც არაფერი მოიძებნა — წითლად */
  missing: { fileId: string; fileName: string }[];
  /** მონიშნული სტრიქონების key-ები შედარებისთვის */
  picked: string[];
  onTogglePick: (key: string) => void;
  /** სტრიქონზე დაჭერა — ფაილის გახსნა */
  onOpen: (group: SearchGroup) => void;
  t: Dictionary["dashboard"]["globalSearch"];
}
