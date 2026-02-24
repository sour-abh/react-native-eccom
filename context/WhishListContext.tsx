import { dummyWishlist } from "@/assets/assets";
import { Product, WishlistContextType } from "@/assets/constants/types";
import useLocalStorage from "@/hooks/use-localstorage";
import { createContext, useContext, useEffect, useState } from "react";

const WhishlistContext = createContext<
  (WishlistContextType & { clearWishlist: () => void }) | undefined
>(undefined);

export function WhishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useLocalStorage("wishlist", []);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = (product: Product) => {
    if (wishlist.find((item: any) => item.id === product.id)) {
      setWishlist(wishlist.filter((item: any) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };
  const clearWishlist = () => {
    setLoading(true);
    setWishlist([]);
    setLoading(false);
  };
  const isInWishlist = (productId: string) => {
    return wishlist.some((item: any) => item.id === productId);
  };
  return (
    <WhishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist, loading, clearWishlist }}
    >
      {children}
    </WhishlistContext.Provider>
  );
}

export function useWhishlist() {
  const context = useContext(WhishlistContext);
  if (!context) {
    throw new Error("useWhishlist must be used within a WhishlistProvider");
  }
  return context;
}
