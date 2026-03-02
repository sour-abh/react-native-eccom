import { useMutation, useQueryClient } from "@tanstack/react-query";
import CartResource from "@/api/CartResource";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CartResource.deleteCart(),

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
