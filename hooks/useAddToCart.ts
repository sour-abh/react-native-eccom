import { useMutation, useQueryClient } from "@tanstack/react-query";
import CartResource from "@/api/CartResource";
import { useAuthStore } from "@/store/auth.store";
import Toast from "react-native-toast-message";

export const useAddToCart = () => {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: any) => {
      if (!accessToken) {
        Toast.show({
          type: "error",
          text1: "Not Authenticated",
          text2: "Please login to add items to cart",
        });
        throw new Error("User not authenticated");
      }
      return CartResource.addToCart(item);
    },

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previous = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old) {
          return {
            cartItems: [newItem],
          };
        }
        return {
          ...old,
          cartItems: [...(old?.cartItems ?? []), newItem],
        };
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
