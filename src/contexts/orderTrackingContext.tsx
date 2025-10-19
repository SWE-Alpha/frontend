"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  total: number;
  deliveryType: "delivery" | "pickup";
  currentStatus: string;
  estimatedCompletionTime: Date;
  createdAt: Date;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          estimatedCompletionTime: new Date(order.estimatedCompletionTime),
        }));
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error parsing saved orders:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCurrentOrder(order);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            currentStatus: newStatus,
            estimatedCompletionTime: new Date(Date.now() + getEstimatedTime(newStatus) * 60 * 1000)
          }
        : order
    ));

    // Update current order if it's the one being updated
    setCurrentOrder(prev => 
      prev?.id === orderId 
        ? { 
            ...prev, 
            currentStatus: newStatus,
            estimatedCompletionTime: new Date(Date.now() + getEstimatedTime(newStatus) * 60 * 1000)
          }
        : prev
    );
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const refreshOrders = async (): Promise<void> => {
    // In a real app, this would fetch from an API
    // For now, we'll just simulate a refresh
    return new Promise(resolve => {
      setTimeout(() => {
        // You could fetch updated orders from API here
        resolve();
      }, 1000);
    });
  };

  // Helper function to calculate estimated time based on status
  const getEstimatedTime = (status: string): number => {
    const timeMap: { [key: string]: number } = {
      received: 45,
      confirmed: 40,
      preparing: 30,
      ready: 5,
      waiting_rider: 10,
      picked_up: 20,
      out_for_delivery: 15,
      delivered: 0,
      completed: 0,
    };
    return timeMap[status] || 30;
  };

  const value: OrderContextType = {
    orders,
    currentOrder,
    addOrder,
    updateOrderStatus,
    getOrderById,
    refreshOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

export type { Order, OrderItem };