import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import ProductResource from "@/api/ProductResource";

export const useProducts = (params: {
  page?: number | 1;
  limit?: number | 20;
  search?: string | null;
  category?: string | null;
  isActive?: boolean | true;
}) => {
  const state = useAuthStore();
  const isHydrated = state.isHydrated;

  const limit = params.limit || 20;
  
  return useInfiniteQuery({
    queryKey: ["products", params.search, params.category, params.isActive, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await ProductResource.getProduct({
        ...params,
        page: pageParam,
        limit,
      });
      
      // Return the full response to access pagination metadata
      return data;
    },
    enabled: isHydrated,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    getNextPageParam: (lastPageResponse, allPages) => {
      // Extract products and pagination info from backend response
      const products = lastPageResponse?.data || lastPageResponse?.products || (Array.isArray(lastPageResponse) ? lastPageResponse : []);
      const pagination = lastPageResponse?.meta || lastPageResponse?.pagination || lastPageResponse?.paginationInfo || {};

      // Method 1: Check hasNextPage from backend
      if (pagination.hasNextPage !== undefined) {
        return pagination.hasNextPage ? allPages.length + 1 : undefined;
      }

      // Method 2: Check totalPages vs currentPage
      if (pagination.totalPages && pagination.page) {
        return pagination.page < pagination.totalPages ? allPages.length + 1 : undefined;
      }

      // Method 3: Check total count vs loaded items
      if (pagination.total !== undefined) {
        const loadedCount = allPages.reduce((sum, page) => {
          const items = page?.data || page?.products || (Array.isArray(page) ? page : []);
          return sum + items.length;
        }, 0);
        return loadedCount < pagination.total ? allPages.length + 1 : undefined;
      }

      // Method 4: Fallback to array length check
      if (Array.isArray(products) && products.length < limit) {
        return undefined;
      }

      return Array.isArray(products) && products.length === limit ? allPages.length + 1 : undefined;
    },
    select: (data) => {
      // Flatten the pages for easier access to products
      return {
        ...data,
        flattenedData: data.pages.flatMap(page => 
          page?.data || page?.products || (Array.isArray(page) ? page : [])
        ),
      };
    },
  });
};
