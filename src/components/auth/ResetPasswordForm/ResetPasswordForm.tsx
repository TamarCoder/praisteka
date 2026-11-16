"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import { createResetSchema, type ResetValues } from "@/schemas/auth.schema";
import styles from "../authForm.module.scss";
import type { ResetPasswordFormProps } from "./ResetPasswordForm.types";

export function ResetPasswordForm({ t, onSubmit }: ResetPasswordFormProps) {
  const { register, handleSubmit, formState } = useForm<ResetValues>({
    resolver: zodResolver(createResetSchema(t.errors)),
    defaultValues: { password: "", password2: "" },
  });
  const { errors, isSubmitting } = formState;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label={t.fields.newPassword} error={errors.password?.message}>
        <PasswordInput labels={t.passwordToggle} placeholder={t.placeholders.password} autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <Field label={t.fields.password2} error={errors.password2?.message}>
        <PasswordInput labels={t.passwordToggle} placeholder={t.placeholders.password2} autoComplete="new-password" invalid={!!errors.password2} {...register("password2")} />
      </Field>
      <Button type="submit" size={ButtonSize.Lg} fullWidth loading={isSubmitting}>
        {isSubmitting ? t.resetPage.saving : t.resetPage.submit}
      </Button>
    </form>
  );
}
