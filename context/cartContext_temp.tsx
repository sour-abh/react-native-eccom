import useLocalStorage from "@/hooks/use-localstorage";
import CartReducer from "@/reducer/cartReducer";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

// const CartContextType={
//     cart:Product[],
//     addToCart:(product:Product)=>void,
//     removeFromCart:(productId:string)=>void,
//     clearCart:()=>void,
//     isInCart:(productId:string)=>boolean,
//     cartCount:number,
//     cartTotal:number
// }

const cartContext = createContext(null);

export function useCartContext() {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [persistedCart, setPersistedCart] = useLocalStorage("cart", []);
  const [state, dispatch] = useReducer(CartReducer, {
    items: persistedCart,
  });
  useEffect(() => {
    setPersistedCart(state.items);
  }, [setPersistedCart, state.items]);
  return (
    <cartContext.Provider
      value={useMemo(() => ({ state, dispatch }), [state, dispatch])}
    >
      {children}
    </cartContext.Provider>
  );
};
