import type { SheetData } from "@/lib/readWorkbook";

// Shapes of priceteka-backend requests and responses

/** Nest-ის შეცდომის პასუხი */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface Me {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "pending" | "blocked";
  /** ISO */
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  /** ISO */
  expiresAt: string;
  user: Me;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface CreateFolderRequest {
  name: string;
}

/** ფაილი სიაში — შიგთავსის გარეშე */
export interface FileSummary {
  id: string;
  companyId: string;
  folderId: string | null;
  fileName: string;
  /** "YYYY-MM-DD" */
  effectiveFrom: string;
}

export interface FileDetail extends FileSummary {
  sheets: SheetData[];
}

export interface CreateFileRequest {
  companyName: string;
  fileName: string;
  effectiveFrom: string;
  folderId?: string;
  /** ვერსია 1-ის შენიშვნა — იმავე მოთხოვნაში */
  note?: string;
  sheets: SheetData[];
}

export interface UpdateFileRequest {
  sheets?: SheetData[];
  folderId?: string | null;
}

/** შენახული ვერსია — შიგთავსის გარეშე */
export interface SnapshotSummary {
  id: string;
  fileId: string;
  /** 1, 2, 3… ფაილის შიგნით */
  n: number;
  note: string;
  /** ISO */
  savedAt: string;
}

export interface SnapshotDetail extends SnapshotSummary {
  sheets: SheetData[];
}

export interface CreateSnapshotRequest {
  note?: string;
}

export enum ErrorAction {
  Register = "register",
  Login = "login",
  CreateFolder = "createFolder",
  Upload = "upload",
  ViewHistory = "viewHistory",
}

export interface ReportErrorRequest {
  action: ErrorAction;
  code: string;
  message: string;
  email?: string;
}
