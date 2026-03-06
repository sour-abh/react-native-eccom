import { useMutation, useQueryClient } from "@tanstack/react-query";
import CartResource from "@/api/CartResource";
import { useAuthStore } from "@/store/auth.store";
import Toast from "react-native-toast-message";

export const useUpdateCartItems = () => {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, item }: { id: string; item: any }) => {
      if (!accessToken) {
        Toast.show({
          type: "error",
          text1: "Not Authenticated",
          text2: "Please login to update cart items",
        });
        throw new Error("User not authenticated");
      }
      return CartResource.updateCartItem(id, item);
    },

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previous = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old) {
          return old;
        }
        const cartItems = old.cartItems ?? old.items ?? [];
        const nextItems = cartItems.map((cartItem: any) =>
          cartItem.product?.id === newItem.id || cartItem.id === newItem.id
            ? { ...cartItem, ...newItem.item }
            : cartItem,
        );
        return { ...old, cartItems: nextItems };
      });

      return { previous };
    },

    onError: (err, newItem, context) => {
      queryClient.setQueryData(["cart"], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
