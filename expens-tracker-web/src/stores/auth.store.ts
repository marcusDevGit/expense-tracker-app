import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
};

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    login: (user, accessToken) => {
      localStorage.setItem("@expense:token", accessToken);
      set({ user, accessToken, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem("@expense:token");
      set({ user: null, accessToken: null, isAuthenticated: false });
    },
  }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },

  )
);
