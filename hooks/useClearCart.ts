import { useMutation, useQueryClient } from "@tanstack/react-query";
import CartResource from "@/api/CartResource";
import { useAuthStore } from "@/store/auth.store";
import Toast from "react-native-toast-message";

export const useClearCart = () => {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        Toast.show({
          type: "error",
          text1: "Not Authenticated",
          text2: "Please login to clear cart",
        });
        throw new Error("User not authenticated");
      }
      return CartResource.deleteCart();
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previous = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old: any) => ({
        ...old,
        cartItems: [],
        totalPrice: 0,
      }));

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
