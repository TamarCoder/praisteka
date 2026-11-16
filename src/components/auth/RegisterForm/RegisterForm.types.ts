import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { RegisterValues } from "@/schemas/auth.schema";

export interface RegisterFormProps {
  t: Dictionary["auth"];
  /** აბრუნებს შეცდომის ტექსტს, ან undefined წარმატებისას */
  onSubmit: (values: RegisterValues) => Promise<string | undefined>;
  onBusyChange?: (busy: boolean) => void;
}
