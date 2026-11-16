"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Banner } from "@/components/ui/Banner/Banner";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import { createLoginSchema, type LoginValues } from "@/schemas/auth.schema";
import styles from "../authForm.module.scss";
import type { LoginFormProps } from "./LoginForm.types";

export function LoginForm({ t, forgotHref, onSubmit, onBusyChange, defaultEmail = "" }: LoginFormProps) {
  const [formError, setFormError] = useState<string>();
  const { register, handleSubmit, formState } = useForm<LoginValues>({
    resolver: zodResolver(createLoginSchema(t.errors)),
    defaultValues: { email: defaultEmail, password: "" },
  });
  const { errors, isSubmitting } = formState;

  useEffect(() => onBusyChange?.(isSubmitting), [isSubmitting, onBusyChange]);
  // ველის შეცვლისას ფორმის შეცდომა ქრება (2 Auth:79)
  const clearError = { onChange: () => setFormError(undefined) };

  const submit = handleSubmit(async (values) => setFormError(await onSubmit(values)));

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {formError && <Banner>{formError}</Banner>}
      <Field label={t.fields.email} error={errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder={t.placeholders.email} invalid={!!errors.email} {...register("email", clearError)} />
      </Field>
      <Field label={t.fields.password} error={errors.password?.message}>
        <PasswordInput labels={t.passwordToggle} placeholder={t.placeholders.password} autoComplete="current-password" invalid={!!errors.password} {...register("password", clearError)} />
      </Field>
      <Button type="submit" size={ButtonSize.Lg} fullWidth loading={isSubmitting}>
        {isSubmitting ? t.submit.loggingIn : t.submit.login}
      </Button>
      <Button variant={ButtonVariant.Text} href={forgotHref} className={styles.forgot}>
        {t.forgot}
      </Button>
    </form>
  );
}
