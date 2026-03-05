import instance from "@/api/base";

type CategoryResourceType = {
  createCategory: (data: any) => any;
  updateCategory: (id: string, data: any) => any;
  deleteCategory: (id: string) => any;
  getAllCategories: (params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) => any;
  getCategoryById: (id: string) => any;
  getCategoryBySlug: (slug: string) => any;
};

const CategoryResource: CategoryResourceType = {
  createCategory: (data: any) => {
    return instance.post("/categories", data);
  },
  updateCategory: (id: string, data: any) => {
    return instance.patch(`/categories/${id}`, data);
  },
  deleteCategory: (id: string) => {
    return instance.delete(`/categories/${id}`);
  },
  getAllCategories: (params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) => {
    return instance.get("/categories/all", { params });
  },
  getCategoryById: (id: string) => {
    return instance.get(`/categories/${id}`);
  },
  getCategoryBySlug: (slug: string) => {
    return instance.get(`/categories/slug/${slug}`);
  },
};
export default CategoryResource;
