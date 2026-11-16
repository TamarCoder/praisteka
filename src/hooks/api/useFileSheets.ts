"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { filesApi } from "@/api/files";
import { trimSheet, type SheetData } from "@/lib/readWorkbook";

/** ბოლო ცვლილებიდან რამდენ ხანში ინახება */
const SAVE_DELAY_MS = 800;

interface Waiter {
  resolve: () => void;
  reject: (error: unknown) => void;
}

/**
 * ღია ფაილის ფურცლები. update — ეკრანზე მაშინვე, სერვერზე 0.8 წამის შემდეგ ერთ PATCH-ად.
 * flush — დაუყოვნებლივ შენახვა (მაგ. ვერსიის შენახვამდე).
 */
export function useFileSheets(fileId: string | undefined) {
  const key = fileId ? API_ENDPOINTS.file(fileId) : null;
  const { data, isLoading, mutate } = useSWR(key, () => filesApi.get(fileId!));
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef<{ id: string; sheets: SheetData[] }>(undefined);
  const waiters = useRef<Waiter[]>([]);
  // ძველ ატვირთვებში ცარიელი სტრიქონები/სვეტები — ეკრანზე აღარ ჩანს; პირველი რედაქტირება სუფთად შეინახავს
  const sheets = useMemo(() => data?.sheets.map(trimSheet), [data]);

  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    const pending = latest.current;
    const waiting = waiters.current;
    latest.current = undefined;
    waiters.current = [];
    if (!pending) return;
    try {
      await filesApi.update(pending.id, { sheets: pending.sheets });
      waiting.forEach((w) => w.resolve());
    } catch (error) {
      waiting.forEach((w) => w.reject(error));
      throw error;
    }
  }, []);

  // სხვა ფაილზე გადასვლისას ან გვერდიდან წასვლისას — დაუსეივებელი ცვლილება ინახება
  useEffect(() => () => void flush().catch(() => {}), [fileId, flush]);

  const update = (index: number, sheet: SheetData) => {
    if (!data || !fileId) return;
    const next = (latest.current?.id === fileId ? latest.current.sheets : (sheets ?? data.sheets)).map((s, i) => (i === index ? sheet : s));
    latest.current = { id: fileId, sheets: next };
    void mutate({ ...data, sheets: next }, { revalidate: false });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush().catch(() => {}), SAVE_DELAY_MS);
    return new Promise<void>((resolve, reject) => waiters.current.push({ resolve, reject }));
  };

  return { sheets, loading: isLoading, update, flush };
}
