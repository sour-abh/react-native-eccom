import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WishListState {
  wishList: any[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishListStore = create<WishListState>()(
  persist(
    (set, get) => ({
      wishList: [],

      toggleWishlist: (product) =>
        set((state) => {
          if (state.wishList.some((item) => item.id === product.id)) {
            return {
              wishList: state.wishList.filter((item) => item.id !== product.id),
            };
          }
          return { wishList: [...state.wishList, product] };
        }),

      clearWishlist: () => set({ wishList: [] }),
      isInWishlist: (id: string) => !!get().wishList.find((i) => i.id === id),
    }),
    {
      name: "wishlist",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
