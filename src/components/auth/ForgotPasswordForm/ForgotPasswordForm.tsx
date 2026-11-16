"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { createForgotSchema, type ForgotValues } from "@/schemas/auth.schema";
import styles from "../authForm.module.scss";
import type { ForgotPasswordFormProps } from "./ForgotPasswordForm.types";

export function ForgotPasswordForm({ t, onSubmit, backHref }: ForgotPasswordFormProps) {
  const { register, handleSubmit, formState } = useForm<ForgotValues>({
    resolver: zodResolver(createForgotSchema(t.errors)),
    defaultValues: { email: "" },
  });
  const { errors, isSubmitting } = formState;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label={t.fields.email} error={errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder={t.placeholders.email} invalid={!!errors.email} {...register("email")} />
      </Field>
      <Button type="submit" size={ButtonSize.Lg} fullWidth loading={isSubmitting}>
        {isSubmitting ? t.forgotPage.sending : t.forgotPage.submit}
      </Button>
      <Button variant={ButtonVariant.Text} href={backHref} className={styles.forgot}>
        {t.backToLogin}
      </Button>
    </form>
  );
}
