import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { ResetValues } from "@/schemas/auth.schema";

export interface ResetPasswordFormProps {
  t: Dictionary["auth"];
  onSubmit: (values: ResetValues) => Promise<void>;
}
