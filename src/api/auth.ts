import { API_ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/fetcher";
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  Me,
  RegisterRequest,
  UpdateProfileRequest,
} from "@/types/api";

export const authApi = {
  register: (input: RegisterRequest) =>
    http.post<Me>(API_ENDPOINTS.authRegister, input),
  login: (input: LoginRequest) =>
    http.post<LoginResponse>(API_ENDPOINTS.authLogin, input),
  logout: () => http.post<void>(API_ENDPOINTS.authLogout),
  me: () => http.get<Me>(API_ENDPOINTS.authMe),
  updateProfile: (input: UpdateProfileRequest) =>
    http.patch<Me>(API_ENDPOINTS.authMe, input),
  changePassword: (input: ChangePasswordRequest) =>
    http.post<void>(API_ENDPOINTS.authPassword, input),
  deleteAccount: () => http.delete(API_ENDPOINTS.authMe),
};
