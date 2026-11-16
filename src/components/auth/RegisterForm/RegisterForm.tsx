"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Banner } from "@/components/ui/Banner/Banner";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import { createRegisterSchema, type RegisterValues } from "@/schemas/auth.schema";
import styles from "../authForm.module.scss";
import type { RegisterFormProps } from "./RegisterForm.types";

export function RegisterForm({ t, onSubmit, onBusyChange }: RegisterFormProps) {
  const [formError, setFormError] = useState<string>();
  const { register, handleSubmit, formState } = useForm<RegisterValues>({
    resolver: zodResolver(createRegisterSchema(t.errors)),
    defaultValues: { name: "", email: "", password: "", password2: "" },
  });
  const { errors, isSubmitting } = formState;

  useEffect(() => onBusyChange?.(isSubmitting), [isSubmitting, onBusyChange]);
  // ველის შეცვლისას ფორმის შეცდომა ქრება
  const clearError = { onChange: () => setFormError(undefined) };
  const submit = handleSubmit(async (values) => setFormError(await onSubmit(values)));

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {formError && <Banner>{formError}</Banner>}
      <Field label={t.fields.name} error={errors.name?.message}>
        <Input autoComplete="name" placeholder={t.placeholders.name} invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label={t.fields.email} error={errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder={t.placeholders.email} invalid={!!errors.email} {...register("email", clearError)} />
      </Field>
      <Field label={t.fields.password} error={errors.password?.message}>
        <PasswordInput labels={t.passwordToggle} placeholder={t.placeholders.password} autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <Field label={t.fields.password2} error={errors.password2?.message}>
        <PasswordInput labels={t.passwordToggle} placeholder={t.placeholders.password2} autoComplete="new-password" invalid={!!errors.password2} {...register("password2")} />
      </Field>
      <Button type="submit" size={ButtonSize.Lg} fullWidth loading={isSubmitting}>
        {isSubmitting ? t.submit.registering : t.submit.register}
      </Button>
    </form>
  );
}
