import { z } from "zod";
import type { Dictionary } from "@/i18n/dictionaries/ka";

type AuthErrors = Dictionary["auth"]["errors"];

// 2 Auth:69-76
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const createLoginSchema = (errors: AuthErrors) =>
  z.object({
    email: z.string().regex(EMAIL_PATTERN, errors.email),
    password: z.string().min(8, errors.password),
  });

export const createRegisterSchema = (errors: AuthErrors) =>
  z
    .object({
      name: z.string().trim().min(3, errors.name),
      email: z.string().regex(EMAIL_PATTERN, errors.email),
      password: z.string().min(8, errors.password),
      password2: z.string(),
    })
    .refine((v) => v.password2 === v.password, { path: ["password2"], message: errors.password2 });

export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>;

export const createForgotSchema = (errors: AuthErrors) =>
  z.object({ email: z.string().regex(EMAIL_PATTERN, errors.email) });

export const createResetSchema = (errors: AuthErrors) =>
  z
    .object({ password: z.string().min(8, errors.password), password2: z.string() })
    .refine((v) => v.password2 === v.password, { path: ["password2"], message: errors.password2 });

export type ForgotValues = z.infer<ReturnType<typeof createForgotSchema>>;
export type ResetValues = z.infer<ReturnType<typeof createResetSchema>>;
