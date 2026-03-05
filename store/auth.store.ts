import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setUser: (user: any) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
  setIsHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,
      setTokens: (access: string, refresh: string) =>
        set({ accessToken: access, refreshToken: refresh }),
      setIsHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
      setUser: (user: any) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) =>
          AsyncStorage.setItem(name, JSON.stringify(value)),
        removeItem: async (name) => AsyncStorage.removeItem(name),
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setIsHydrated(true);
        }
      },
    },
  ),
);
