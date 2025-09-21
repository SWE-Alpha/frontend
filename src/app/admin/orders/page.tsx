"use client";

import React, { useState, useCallback, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "./types";
import { calculateOrderStats, filterOrders, getMockOrders } from "./utils";
import { OrderStats, OrderFilters, OrderTable } from "./components";

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = useCallback(() => {
    const mockOrders = getMockOrders();
    setOrders(mockOrders);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const refreshOrders = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const filteredOrders = filterOrders(orders, searchQuery, statusFilter);
  const stats = calculateOrderStats(orders);

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