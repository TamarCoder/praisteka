"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { Modal } from "@/components/ui/Modal/Modal";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import type { FolderModalProps } from "./FolderModal.types";

export function FolderModal({ open, onClose, t, onSubmit }: FolderModalProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  const close = () => {
    setName("");
    setError(undefined);
    onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError(t.errors.folderName);
    const failed = onSubmit(name);
    if (failed) return setError(failed);
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={t.folderModal.title}
      size={ModalSize.Md}
      closeLabel={t.uploadModal.close}
      footer={
        <>
          <Button variant={ButtonVariant.Secondary} onClick={close}>
            {t.uploadModal.cancel}
          </Button>
          <Button type="submit" form={formId}>
            {t.folderModal.submit}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate>
        <Field label={t.folderModal.name} error={error}>
          <Input
            autoFocus
            autoComplete="off"
            placeholder={t.folderModal.placeholder}
            invalid={!!error}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(undefined);
            }}
          />
        </Field>
      </form>
    </Modal>
  );
}
