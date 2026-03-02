import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../api/base";
import CartResource from "@/api/CartResource";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: any) => CartResource.addToCart(item),

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previous = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old: any) => ({
        ...old,
        items: [...old.items, newItem],
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
