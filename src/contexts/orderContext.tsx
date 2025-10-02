"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Address interface (matches createOrder structure)
export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  status: string;
  notes: string | null;
  adminNotes: string | null;
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  total: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentIntentId: string | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
}

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  refreshOrders: (token?: string) => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const fetchOrders = async () => {
  setLoading(true);
  try {
    console.log("Fetching Orders");
    
    const res = await fetch(`https://backend-mmow.vercel.app/api/admin/orders`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch Orders:", errorText);
      return;
    }

    const data = await res.json();
    console.log("Fetched Orders:", data);
    // Normalize status to lowercase for all orders
    const normalizedOrders = data.data.map((order: Order) => ({
      ...order,
      status: typeof order.status === "string" ? order.status.toLowerCase() : order.status,
    }));
    setOrders(normalizedOrders);
  } catch (error) {
    console.error("Error fetching Orders:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOrders(); // consider passing token if required
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, loading, refreshOrders: fetchOrders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};
