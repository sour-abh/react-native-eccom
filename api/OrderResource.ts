import instance from "@/api/base";

type OrderResourceType = {
  createOrder: (data: any) => any;
  updateOrder: (id: string, data: any) => any;
  deleteOrder: (id: string) => any;
  getAllOrders: (params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }) => any;
  getOrderById: (id: string) => any;
  getUserAllOrders: (params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) => any;
  getUserOrderById: (id: string) => any;
  AdminUpdateOrder: (id: string, data: any) => any;
  UserUpdateOrder: (id: string, data: any) => any;
  AdminDeleteOrder: (id: string) => any;
  UserDeleteOrder: (id: string) => any;
};

const OrderResource: OrderResourceType = {
  createOrder: (data: any) => {
    return instance.post("/orders", data);
  },
  getAllOrders: (params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }) => {
    return instance.get("/orders/admin/all", { params });
  },
  getUserAllOrders: (params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) => {
    return instance.get("/", { params });
  },
  getOrderById: (id: string) => {
    return instance.get(`/orders/admin/${id}`);
  },
  updateOrder: (id: string, data: any) => {
    return instance.patch(`/orders/admin/${id}`, data);
  },
  deleteOrder: (id: string) => {
    return instance.delete(`/orders/admin/${id}`);
  },

  getUserOrderById: (id: string) => {
    return instance.get(`/orders/user/${id}`);
  },
  AdminUpdateOrder: (id: string, data: any) => {
    return instance.patch(`/orders/admin/${id}`, data);
  },
  UserUpdateOrder: (id: string, data: any) => {
    return instance.patch(`/orders/user/${id}`, data);
  },
  AdminDeleteOrder: (id: string) => {
    return instance.delete(`/orders/admin/${id}`);
  },
  UserDeleteOrder: (id: string) => {
    return instance.delete(`/orders/user/${id}`);
  },
};
export default OrderResource;
