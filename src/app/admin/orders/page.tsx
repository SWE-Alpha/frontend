"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/contexts/orderContext";
import type { Order as AdminOrder, OrderItem as AdminOrderItem } from "./types";
import { calculateOrderStats, filterOrders, getMockOrders } from "./utils";
import { OrderStats, OrderFilters, OrderTable } from "./components";

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const { orders: contextOrders } = useOrders();

  // Map context orders to admin Order type
  const allowedStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out-for-delivery",
    "delivered",
    "cancelled",
  ];
  const adminOrders: AdminOrder[] = contextOrders.map((order) => {
    // Map context Order to admin Order
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.shippingAddress?.phone ?? "",
      customerAddress:
        order.shippingAddress
          ? `${order.shippingAddress.address1}${order.shippingAddress.address2 ? ", " + order.shippingAddress.address2 : ""}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`
          : "",
      items: order.items.map((item): AdminOrderItem => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        addOns: [], // If you have addOns in context, map here
      })),
      total: typeof order.total === "number" ? order.total : Number(order.total),
      status: allowedStatuses.includes(order.status)
        ? (order.status as AdminOrder["status"])
        : "pending",
      orderType: "delivery",
      paymentMethod:
        (order.paymentMethod as AdminOrder["paymentMethod"]) ?? "cash", // fallback to cash
      paymentStatus:
        (order.paymentStatus as AdminOrder["paymentStatus"]) ?? "pending", // fallback to pending
      orderTime: order.createdAt,
      estimatedDelivery: order.deliveredAt ?? "",
      notes: order.notes ?? undefined,
    };
  });

  const updateOrderStatus = (orderId: string, newStatus: AdminOrder["status"]) => {
    // Implement status update logic here if needed (e.g., API call)
    // For now, this is a placeholder
  };

  const refreshOrders = () => {
    setIsLoading(true);
    // Simulate API call or context refresh if available
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const filteredOrders = filterOrders(adminOrders, searchQuery, statusFilter);
  const stats = calculateOrderStats(adminOrders);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-600">Track and manage all customer orders</p>
        </div>
        <Button onClick={refreshOrders} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
  <OrderStats stats={stats} />

      {/* Filters and Search */}
      <OrderFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <OrderTable orders={filteredOrders} onUpdateStatus={updateOrderStatus} />
      </div>
    </div>
  );
}