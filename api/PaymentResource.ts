import instance from "./base";

type PaymentResourceType = {
  createPayment: (data: any) => any;
  updatePayment: (id: string, data: any) => any;
  deletePayment: (id: string) => any;
  getAllPayments: () => any;
  getPaymentById: (id: string) => any;
  confirmPayment: (data: any) => any;
  getPaymentByOrderId: (orderId: string) => any;
};
const PaymentResource: PaymentResourceType = {
  createPayment: (data: any) => {
    return instance.post("/payments/create-intent", data);
  },

  confirmPayment: (data: any) => {
    return instance.post("/payments/confirm", data);
  },
  updatePayment: (id: string, data: any) => {
    return instance.patch(`/payments/${id}`, data);
  },
  deletePayment: (id: string) => {
    return instance.delete(`/payments/${id}`);
  },
  getAllPayments: () => {
    return instance.get("/payments");
  },
  getPaymentById: (id: string) => {
    return instance.get(`/payments/${id}`);
  },
  getPaymentByOrderId: (orderId: string) => {
    return instance.get(`/payments/order/${orderId}`);
  },
};
export default PaymentResource;
