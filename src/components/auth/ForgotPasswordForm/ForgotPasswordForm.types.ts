import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { ForgotValues } from "@/schemas/auth.schema";

export interface ForgotPasswordFormProps {
  t: Dictionary["auth"];
  onSubmit: (values: ForgotValues) => Promise<void>;
  backHref: string;
}
