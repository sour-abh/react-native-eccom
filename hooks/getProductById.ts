import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import ProductResource from "@/api/ProductResource";

export const GetProductById = (id:string) => {
  const state = useAuthStore();
  const isHydrated = state.isHydrated;
  
  return useQuery({
    queryKey: ["cart",{id}],
    queryFn: async () => {
      const { data } = await ProductResource.getProductById(id);
      return data;
    },
    enabled:  isHydrated,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    
  });
};
