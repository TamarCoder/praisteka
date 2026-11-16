"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Banner } from "@/components/ui/Banner/Banner";
import { Button } from "@/components/ui/Button/Button";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import { getRememberedEmail, saveLogin } from "@/lib/rememberLogin";
import { createLoginSchema, type LoginValues } from "@/schemas/auth.schema";
import styles from "../authForm.module.scss";
import type { LoginFormProps } from "./LoginForm.types";

export function LoginForm({ t, forgotHref, onSubmit, onBusyChange, defaultEmail = "" }: LoginFormProps) {
  const [formError, setFormError] = useState<string>();
  const [remember, setRemember] = useState(true);
  const { register, handleSubmit, formState, setValue } = useForm<LoginValues>({
    resolver: zodResolver(createLoginSchema(t.errors)),
    defaultValues: { email: defaultEmail, password: "" },
  });
  const { errors, isSubmitting } = formState;

  useEffect(() => onBusyChange?.(isSubmitting), [isSubmitting, onBusyChange]);
  // შენახული ელფოსტა (localStorage — მხოლოდ კლიენტზე)
  useEffect(() => {
    const saved = getRememberedEmail();
    if (saved && !defaultEmail) setValue("email", saved);
  }, [defaultEmail, setValue]);
  // ველის შეცვლისას ფორმის შეცდომა ქრება (2 Auth:79)
  const clearError = { onChange: () => setFormError(undefined) };

  const submit = handleSubmit(async (values) => {
    const error = await onSubmit(values);
    if (!error) saveLogin(remember, values.email.trim(), values.password);
    setFormError(error);
  });

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {formError && <Banner>{formError}</Banner>}
      <Field label={t.fields.email} error={errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder={t.placeholders.email} invalid={!!errors.email} {...register("email", clearError)} />
      </Field>
      <Field label={t.fields.password} error={errors.password?.message}>
        <PasswordInput labels={t.passwordToggle} placeholder={t.placeholders.password} autoComplete="current-password" invalid={!!errors.password} {...register("password", clearError)} />
      </Field>
      <Checkbox label={t.remember} checked={remember} onChange={(e) => setRemember(e.target.checked)} />
      <Button type="submit" size={ButtonSize.Lg} fullWidth loading={isSubmitting}>
        {isSubmitting ? t.submit.loggingIn : t.submit.login}
      </Button>
      <Button variant={ButtonVariant.Text} href={forgotHref} className={styles.forgot}>
        {t.forgot}
      </Button>
    </form>
  );
}
