import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { API_ENDPOINTS } from "@/api/endpoints";
import { foldersApi } from "@/api/folders";

export function useFolderMutations() {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating } = useSWRMutation(API_ENDPOINTS.folders, (_key, { arg }: { arg: string }) => foldersApi.create({ name: arg }));

  const createFolder = async (name: string) => {
    const folder = await trigger(name);
    await mutate(API_ENDPOINTS.folders);
    return folder;
  };

  // ფოლდერის ფაილები არ იშლება — ბაზა მათ ფოლდერის გარეშე ტოვებს (ON DELETE SET NULL)
  const deleteFolder = async (folderId: string) => {
    await foldersApi.delete(folderId);
    await mutate((key) => key === API_ENDPOINTS.folders || key === API_ENDPOINTS.files);
  };

  return { createFolder, deleteFolder, isMutating };
}
