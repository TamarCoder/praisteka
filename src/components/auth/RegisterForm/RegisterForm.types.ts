import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { RegisterValues } from "@/schemas/auth.schema";

export interface RegisterFormProps {
  t: Dictionary["auth"];
  onSubmit: (values: RegisterValues) => Promise<void>;
  onBusyChange?: (busy: boolean) => void;
}
