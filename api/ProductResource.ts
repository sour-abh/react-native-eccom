import instance from "@/api/base";
import { AxiosRequestConfig } from "axios";

type ProductResourceType = {
  createProducts: (data: any) => any;
  getProduct: (data: any) => any;
  getProductById: (id: string) => any;
  updateProduct: (id: string, data: any) => any;
  deleteProduct: (id: string) => any;
  updateProductStock: (id: string, quantity: number) => any;
};

const ProductResource: ProductResourceType = {
  //admin only
  createProducts: (data: any) => {
    return instance.post("/products", data);
  },
  //all users
  getProduct: (query: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isActive?: boolean;
  }) => {
    return instance.get(`/products`, {
      params: {
        page: query.page,
        limit: query.limit,
        category: query.category,
        search: query.search,
        isActive: query.isActive,
      },
    });
  },
  getProductById: (id: string) => {
    return instance.get(`/products/${id}`);
  },
  updateProduct: (id: string, data: any) => {
    return instance.patch(`/products/${id}`, data);
  },
  deleteProduct: (id: string) => {
    return instance.delete(`/products/${id}`);
  },
  updateProductStock: (id: string, quantity: number) => {
    return instance.patch(`/products/${id}/stock`, { quantity });
  },
};
export default ProductResource;
