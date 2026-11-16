import { useSWRConfig } from "swr";
import { authApi } from "@/api/auth";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useSessionStore } from "@/stores/session.store";
import type { ChangePasswordRequest, UpdateProfileRequest } from "@/types/api";

/** პროფილი, პაროლი, გასვლა, ანგარიშის წაშლა */
export function useAccountMutations() {
  const { mutate } = useSWRConfig();

  // გასვლისას cache მთლიანად იშლება, რომ შემდეგ მომხმარებელს წინას მონაცემი არ დახვდეს
  const clearCache = () => mutate(() => true, undefined, { revalidate: false });

  const updateProfile = async (input: UpdateProfileRequest) => {
    const me = await authApi.updateProfile(input);
    await mutate(API_ENDPOINTS.authMe, me, { revalidate: false });
    return me;
  };

  const changePassword = (input: ChangePasswordRequest) => authApi.changePassword(input);

  const logout = async () => {
    await authApi.logout().catch(() => {});
    useSessionStore.getState().signOut();
    await clearCache();
  };

  const deleteAccount = async () => {
    await authApi.deleteAccount();
    useSessionStore.getState().signOut();
    await clearCache();
  };

  return { updateProfile, changePassword, logout, deleteAccount };
}
