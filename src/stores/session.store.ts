import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  /** შესულია? სესია თავად HttpOnly cookie-შია — JavaScript ვერ კითხულობს; აქ მხოლოდ ნიშანია */
  signedIn: boolean;
  /** localStorage-იდან აღდგენა დასრულდა */
  hydrated: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      signedIn: false,
      hydrated: false,
      signIn: () => set({ signedIn: true }),
      signOut: () => set({ signedIn: false }),
    }),
    {
      name: "priceteka-session",
      // v0-ში აქ token ინახებოდა — მიგრაცია მას localStorage-იდან შლის (ერთხელ თავიდან შესვლა)
      version: 1,
      migrate: () => ({ signedIn: false }),
      skipHydration: true,
      partialize: ({ signedIn }) => ({ signedIn }),
      onRehydrateStorage: () => () => useSessionStore.setState({ hydrated: true }),
    },
  ),
);
