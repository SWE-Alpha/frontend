import React from "react";
import { Clock, Check, Package, Truck } from "lucide-react";
import { Order, OrderStats } from "../types";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "ready":
      return "bg-purple-100 text-purple-800";
    case "out-for-delivery":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "confirmed":
      return <Check className="w-4 h-4" />;
    case "preparing":
      return <Package className="w-4 h-4" />;
    case "ready":
      return <Check className="w-4 h-4" />;
    case "out-for-delivery":
      return <Truck className="w-4 h-4" />;
    case "delivered":
      return <Check className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const calculateOrderStats = (orders: Order[]): OrderStats => {
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    outForDelivery: orders.filter((o) => o.status === "out-for-delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };
};

export const filterOrders = (
  orders: Order[],
  searchQuery: string,
  statusFilter: string
): Order[] => {
  return orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
};

export const getMockOrders = (): Order[] => {
  return [
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "John Doe",
      customerPhone: "+233 24 123 4567",
      customerAddress: "123 Main St, Accra",
      items: [
        {
          id: "1",
          name: "Cherry Dog",
          quantity: 2,
          price: 20.0,
          addOns: ["Cheese", "Fried Egg"],
          note: "Extra spicy",
        },
        {
          id: "2",
          name: "Italian Panini",
          quantity: 1,
          price: 15.0,
          addOns: [],
        },
      ],
      total: 55.0,
      status: "pending",
      orderType: "delivery",
      paymentMethod: "cash",
      paymentStatus: "pending",
      orderTime: "2023-05-15T10:30:00",
      estimatedDelivery: "2023-05-15T11:30:00",
      notes: "Please call before delivery",
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "Jane Smith",
      customerPhone: "+233 20 987 6543",
      customerAddress: "456 Oak Ave, Kumasi",
      items: [
        {
          id: "3",
          name: "Chicken Wings",
          quantity: 1,
          price: 18.0,
          addOns: ["BBQ Sauce"],
        },
      ],
      total: 18.0,
      status: "confirmed",
      orderType: "pickup",
      paymentMethod: "card",
      paymentStatus: "paid",
      orderTime: "2023-05-15T11:15:00",
      estimatedDelivery: "2023-05-15T11:45:00",
    },
  ];
};