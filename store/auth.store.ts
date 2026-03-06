import { create } from "zustand";
import * as SecureStore from "expo-secure-store"
import { createJSONStorage,persist } from "zustand/middleware";

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
      storage: createJSONStorage(()=>({
        getItem:(name)=>SecureStore.getItemAsync(name),
        setItem:(name,value)=>SecureStore.setItemAsync(name,value),

      removeItem:(name)=>SecureStore.deleteItemAsync(name),
      })),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setIsHydrated(true);
        }
      },
    },
  ),
);
