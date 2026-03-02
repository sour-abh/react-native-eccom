import instance from "@/api/base";

type CartResourceType = {
  getCart: () => any;
  addToCart: (data: any) => any;
  updateCartItem: (id: string, data: any) => any;
  deleteCartItem: (id: string) => any;
  deleteCart: () => any;
  mergeCart: (data: any) => any;
};

const CartResource: CartResourceType = {
  getCart: () => {
    return instance.get("/cart");
  },
  addToCart: (data: any) => {
    return instance.post("/cart/items", data);
  },
  updateCartItem: (id: string, data: any) => {
    return instance.patch(`/cart/items/${id}`, data);
  },
  deleteCartItem: (id: string) => {
    return instance.delete(`/cart/items/${id}`);
  },
  deleteCart: () => {
    return instance.delete("/cart");
  },
  mergeCart: (data: any) => {
    return instance.post("/cart/merge", data);
  },
};
export default CartResource;
