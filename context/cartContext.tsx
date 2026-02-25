import { Product } from "@/assets/constants/types";
import { createContext, useContext, useState } from "react";

export type CartContextItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
  price: number;
};
export type CartContextType = {
  cartItems: CartContextItem[];
  totalPrice: number;
  totalItems: number;
  isLoading: boolean;
};
const cartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartContextItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/cart`);
      const data = await response.json();
      setCartItems(data.cartItems);
      setTotalPrice(data.totalPrice);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <cartContext.Provider
      value={{ cartItems, totalPrice, totalItems, isLoading }}
    >
      {children}
    </cartContext.Provider>
  );
};
export const useCartContext = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
