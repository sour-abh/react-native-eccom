import { useQuery } from "@tanstack/react-query";
import instance from "../api/base";
import { useAuthStore } from "@/store/auth.store";

export const useCart = () => {
  const state = useAuthStore();
  const accessToken = state.accessToken;
  const isHydrated = state.isHydrated;
  
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await instance.get("/cart");
      return data;
    },
    enabled: !!accessToken && isHydrated,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
