"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Banner } from "@/components/ui/Banner/Banner";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { DateRangePicker } from "@/components/ui/DateRangePicker/DateRangePicker";
import { Dropzone } from "@/components/ui/Dropzone/Dropzone";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { Modal } from "@/components/ui/Modal/Modal";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
import { createUploadSchema, EXCEL_ACCEPT, type UploadValues } from "@/schemas/upload.schema";
import styles from "./UploadModal.module.scss";
import type { UploadModalProps } from "./UploadModal.types";

// 1 App:28-46
export function UploadModal({ open, onClose, t, calendar, defaultCompany = "", folders, defaultFolder = "", onSubmit }: UploadModalProps) {
  const formId = useId();
  const [formError, setFormError] = useState<string>();
  const { register, control, handleSubmit, reset, formState } = useForm<UploadValues>({
    resolver: zodResolver(createUploadSchema(t.errors)),
    values: { company: defaultCompany, effectiveFrom: "", folder: defaultFolder, file: null },
  });
  const { errors, isSubmitting } = formState;
  const clearError = { onChange: () => setFormError(undefined) };

  const close = () => {
    reset();
    setFormError(undefined);
    onClose();
  };

  const submit = handleSubmit(async ({ company, effectiveFrom, folder, file }) => {
    if (!file) return;
    const error = await onSubmit({ company, effectiveFrom, folder, file });
    if (error) return setFormError(error);
    close();
  });

  return (
    <Modal
      open={open}
      onClose={close}
      title={t.uploadModal.title}
      size={ModalSize.Lg}
      closeLabel={t.uploadModal.close}
      footer={
        <>
          <Button variant={ButtonVariant.Secondary} onClick={close} disabled={isSubmitting}>
            {t.uploadModal.cancel}
          </Button>
          <Button type="submit" form={formId} loading={isSubmitting}>
            {t.uploadModal.submit}
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.form} onSubmit={submit} noValidate>
        {formError && <Banner>{formError}</Banner>}
        {/* კომპანია და ფოლდერი — ერთ რიგში; ფოლდერის სია ფორმის ზედა ნაწილში იშლება და ფანჯარაში ეტევა */}
        <div className={styles.row}>
        <Field label={t.uploadModal.company} error={errors.company?.message}>
          <Input
            placeholder={t.uploadModal.companyPlaceholder}
            invalid={!!errors.company}
            {...register("company", clearError)}
          />
        </Field>
        <Field label={t.uploadModal.folder}>
          <Controller
            control={control}
            name="folder"
            render={({ field }) => <Dropdown label={t.uploadModal.folder} options={folders} value={field.value} onChange={field.onChange} />}
          />
        </Field>
        </div>
        <Field label={t.uploadModal.date} error={errors.effectiveFrom?.message}>
          <Controller
            control={control}
            name="effectiveFrom"
            render={({ field }) => (
              <DateRangePicker
                single
                label={t.uploadModal.date}
                labels={calendar}
                invalid={!!errors.effectiveFrom}
                value={{ from: field.value, to: "" }}
                onChange={(r) => {
                  field.onChange(r.from);
                  setFormError(undefined);
                }}
              />
            )}
          />
        </Field>
        <Controller
          control={control}
          name="file"
          render={({ field, fieldState }) => (
            <div className={styles.file}>
              <Dropzone
                label={field.value?.name ?? t.uploadModal.file}
                hint={t.uploadModal.fileHint}
                accept={EXCEL_ACCEPT}
                invalid={!!fieldState.error}
                disabled={isSubmitting}
                onFile={(file) => {
                  setFormError(undefined);
                  field.onChange(file);
                }}
              />
              {fieldState.error && (
                <span role="alert" className={styles.error}>
                  {fieldState.error.message}
                </span>
              )}
            </div>
          )}
        />
      </form>
    </Modal>
  );
}
