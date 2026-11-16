"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { Toast } from "@/components/ui/Toast/Toast";
import { useFilesHydration } from "@/hooks/useFilesHydration";
import { dictionaries } from "@/i18n/dictionaries";
import { formatDate, formatDateTime } from "@/lib/formatDate";
import { EMAIL_PATTERN } from "@/schemas/auth.schema";
import { useFilesStore } from "@/stores/files.store";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useUserStore } from "@/stores/user.store";
import styles from "./page.module.scss";

const RECENT = 5;

export default function ProfilePage() {
  const locale = usePreferencesStore((s) => s.locale);
  const { user: t } = dictionaries[locale];
  const ready = useFilesHydration();
  const { user, update } = useUserStore();
  const { versions, snapshots } = useFilesStore();
  // null — ველებში რეგისტრაციისას შევსებული მონაცემია
  const [draft, setDraft] = useState<{ name: string; email: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!ready || !user) return <main className={styles.card} aria-hidden />;

  const form = draft ?? { name: user.name, email: user.email };
  const nameOk = form.name.trim().length >= 3;
  const emailOk = EMAIL_PATTERN.test(form.email);
  const changed = form.name.trim() !== user.name || form.email !== user.email;
  const files = versions.slice(-RECENT).reverse();
  const saved = [...snapshots].sort((a, b) => b.savedAt - a.savedAt).slice(0, RECENT);
  const fileName = (id: string) => versions.find((v) => v.id === id)?.fileName ?? "—";

  const save = () => {
    update({ name: form.name.trim(), email: form.email });
    setDraft(null);
    setToast(t.saved);
  };

  return (
    <main className={styles.card}>
      <header className={styles.header}>
        <Button variant={ButtonVariant.Secondary} href="/dashboard" aria-label={t.back} title={t.back} className={styles.back}>
          ←
        </Button>
        <h1 className={styles.title}>{t.profile}</h1>
      </header>

      <div className={styles.body}>
        <section className={styles.identity}>
          <span className={styles.avatar} aria-hidden>{user.name[0]?.toUpperCase()}</span>
          <div className={styles.who}>
            <p className={styles.name}>{user.name}</p>
            <p className={styles.muted}>{user.email}</p>
            <p className={styles.muted}>{t.since}: {formatDateTime(user.createdAt)}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>{t.personal}</h2>
          <div className={styles.fields}>
            <Field label={t.name}>
              <Input value={form.name} onChange={(e) => setDraft({ ...form, name: e.target.value })} invalid={!nameOk} autoComplete="name" />
            </Field>
            <Field label={t.email}>
              <Input type="email" value={form.email} onChange={(e) => setDraft({ ...form, email: e.target.value })} invalid={!emailOk} autoComplete="email" />
            </Field>
          </div>
          <Button className={styles.save} onClick={save} disabled={!changed || !nameOk || !emailOk}>{t.save}</Button>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>{t.activity}</h2>
          <div className={styles.lists}>
            <div>
              <h3 className={styles.label}>{t.recentFiles} ({versions.length})</h3>
              {files.length ? (
                <ul className={styles.list}>
                  {files.map((f) => (
                    <li key={f.id}>
                      <Link href={`/dashboard?file=${f.id}`} className={styles.item}>
                        <span className={styles.itemName}>{f.fileName}</span>
                        <span className={styles.muted}>{formatDate(f.effectiveFrom)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.muted}>{t.noFiles}</p>
              )}
            </div>
            <div>
              <h3 className={styles.label}>{t.recentVersions} ({snapshots.length})</h3>
              {saved.length ? (
                <ul className={styles.list}>
                  {saved.map((s) => (
                    <li key={s.id}>
                      <Link href="/dashboard/history" className={styles.item}>
                        <span className={styles.itemName}>{fileName(s.fileId)} · v{s.n}</span>
                        <span className={styles.muted}>{formatDateTime(s.savedAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.muted}>{t.noVersions}</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} className={styles.toast} />
    </main>
  );
}
