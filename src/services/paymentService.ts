import { apiGet, apiPost, apiDelete, ApiResponse } from '../utils/api';

export type OrderStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface Folder {
  id: number;
  isFree: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Order {
  id: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  bankTranNo?: string | null;
  nameBank?: string | null;
  payDate?: string | null;
  folder: Folder;
  createdBy: User;
}

export interface CreateOrderResponse {
  order: Order;
  orderUrl?: string | null;
}

export const paymentService = {
  createOrder: (folderId: number): Promise<ApiResponse<CreateOrderResponse>> => {
    return apiPost<CreateOrderResponse>(`/exercise/${folderId}/new-order`);
  },

  handleVnpayReturn: (params: Record<string, string>): Promise<ApiResponse<Order>> => {
    return apiGet<Order>('/orders/vnpay-return', params);
  },

  checkOrderStatus: (folderId: number): Promise<ApiResponse<Order | null>> => {
    return apiGet<Order | null>(`/exercise/${folderId}/order-status`);
  },

  cancelOrder: (orderId: string): Promise<ApiResponse<void>> => {
    return apiDelete<void>(`/orders/${orderId}`);
  },
};
