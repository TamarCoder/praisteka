import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { LoginValues } from "@/schemas/auth.schema";

export interface LoginFormProps {
  t: Dictionary["auth"];
  /** აბრუნებს შეცდომის ტექსტს, ან undefined წარმატებისას */
  onSubmit: (values: LoginValues) => Promise<string | undefined>;
  /** „პაროლი დაგავიწყდა?“ ბმული */
  forgotHref: string;
  onBusyChange?: (busy: boolean) => void;
  /** წინასწარ ჩაწერილი ელფოსტა (რეგისტრაციის შემდეგ) */
  defaultEmail?: string;
}
