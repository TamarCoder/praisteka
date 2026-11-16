const id = (value: string) => encodeURIComponent(value);

// ყველა მისამართი ერთ ადგილას — SWR-ის key-ებიც ესენია
export const API_ENDPOINTS = {
  authRegister: "/api/auth/register",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  authMe: "/api/auth/me",
  authPassword: "/api/auth/password",
  companies: "/api/companies",
  folders: "/api/folders",
  folder: (folderId: string) => `/api/folders/${id(folderId)}`,
  files: "/api/files",
  file: (fileId: string) => `/api/files/${id(fileId)}`,
  snapshots: (fileId: string) => `/api/files/${id(fileId)}/snapshots`,
  snapshot: (fileId: string, snapshotId: string) =>
    `/api/files/${id(fileId)}/snapshots/${id(snapshotId)}`,
  errors: "/api/errors",
} as const;
