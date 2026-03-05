import { useQuery } from "@tanstack/react-query";
import instance from "../api/base";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await instance.get("/cart");
      return data;
    },
  });
};
