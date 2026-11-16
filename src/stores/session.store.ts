import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  token: string | null;
  /** localStorage-იდან აღდგენა დასრულდა */
  hydrated: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}

// backend-ის სესიის token (POST /api/auth/login); მომხმარებლის მონაცემი — useMe
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      hydrated: false,
      signIn: (token) => set({ token }),
      signOut: () => set({ token: null }),
    }),
    {
      name: "praisteka-session",
      skipHydration: true,
      partialize: ({ token }) => ({ token }),
      onRehydrateStorage: () => () => useSessionStore.setState({ hydrated: true }),
    },
  ),
);
