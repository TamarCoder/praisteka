import { create } from "zustand";
import { persist } from "zustand/middleware";

// ბექენდამდე — შესული მომხმარებელი ბრაუზერში (რეგისტრაცია/შესვლა წერს, პროფილი ცვლის)
export interface User {
  name: string;
  email: string;
  /** რეგისტრაციის დრო, ms */
  createdAt: number;
}

interface UserState {
  user: User | null;
  /** შესვლა: იგივე ელფოსტაზე ძველი მონაცემი რჩება, სხვაზე — ახალი */
  signIn: (email: string, name?: string) => void;
  update: (patch: Pick<User, "name" | "email">) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email, name) =>
        set((s) => ({
          user:
            s.user?.email === email
              ? { ...s.user, name: name ?? s.user.name }
              : { email, name: name ?? email.split("@")[0], createdAt: Date.now() },
        })),
      update: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
      signOut: () => set({ user: null }),
    }),
    { name: "praisteka-user", skipHydration: true },
  ),
);
