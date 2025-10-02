import React from "react";
import { Clock, Check, Package, Truck } from "lucide-react";
import { Order, OrderStats } from "../types";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-orange-100 text-orange-800";
    case "fulfilled":
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
    case "new":
      return <Clock className="w-4 h-4" />;
    case "confirmed":
      return <Check className="w-4 h-4" />;
    case "in_progress":
      return <Package className="w-4 h-4" />;
    case "fulfilled":
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
    new: orders.filter((o) => o.status === "new").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    fulfilled: orders.filter((o) => o.status === "fulfilled").length,
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


