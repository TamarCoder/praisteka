import { z } from "zod";
import type { Dictionary } from "@/i18n/dictionaries/ka";

type UploadErrors = Dictionary["dashboard"]["errors"];

export const EXCEL_ACCEPT = ".xlsx,.xls";
const EXCEL_EXT = /\.(xlsx|xls)$/i;

export const createUploadSchema = (errors: UploadErrors) =>
  z.object({
    company: z.string().trim().min(1, errors.company),
    effectiveFrom: z.string().min(1, errors.date),
    /** "" — ფოლდერის გარეშე */
    folder: z.string(),
    file: z
      .instanceof(File, { message: errors.file })
      .nullable()
      .refine((f) => f !== null, errors.file)
      .refine((f) => !f || EXCEL_EXT.test(f.name), errors.fileType),
  });

export type UploadValues = z.input<ReturnType<typeof createUploadSchema>>;
