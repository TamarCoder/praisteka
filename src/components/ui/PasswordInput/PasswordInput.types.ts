import type { InputProps } from "../Input/Input.types";

export interface PasswordInputProps extends Omit<InputProps, "type" | "variant"> {
  /** ღილაკის წარწერა ეკრანის წამკითხველისთვის */
  labels: { show: string; hide: string };
}
