import { create } from "zustand";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setUser: (user: any) => set({ user }),
  setTokens: (access: string, refresh: string) =>
    set({ accessToken: access, refreshToken: refresh }),

  logout: () => set({ accessToken: null, refreshToken: null, user: null }),
}));
