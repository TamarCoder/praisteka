import type { ReactNode } from "react";

export enum AuthMode {
  Login = "login",
  Register = "register",
}

export interface AuthCardProps {
  /** თუ არის, ჩანს შესვლა/რეგისტრაციის გადამრთველი */
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  modeLabels?: Record<AuthMode, string>;
  /** სათაური გადამრთველის ნაცვლად (პაროლის აღდგენა) */
  title?: string;
  text?: string;
  /** გადამრთველი დაბლოკილია (გაგზავნისას) */
  busy?: boolean;
  /** ბარათის ქვემოთ, 12px mute */
  hint?: ReactNode;
  children: ReactNode;
}
