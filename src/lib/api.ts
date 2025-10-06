// API utility for orders

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface CreateOrderRequest {
  orderNumber: string;
  customerName: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  items: OrderItem[];

  // Optional fields
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod?: string;
  notes?: string;
}


export interface OrderResponse {
  success: boolean;
  data: CreateOrderRequest;
  message?: string;
}

const URL = 'https://backend-mmow.vercel.app';

export async function createOrder(order: CreateOrderRequest, token: string): Promise<OrderResponse> {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  });
  return res.json();
}
