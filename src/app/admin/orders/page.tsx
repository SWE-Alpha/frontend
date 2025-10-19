"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Eye, Edit, Clock, Package, Truck, CheckCircle, MapPin, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/contexts/orderTrackingContext";
import type { Order } from "@/contexts/orderTrackingContext";

const ORDER_STATUSES = {
  delivery: [
    { id: "received", label: "Order Received", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    { id: "confirmed", label: "Order Confirmed", color: "bg-green-100 text-green-800", icon: CheckCircle },
    { id: "preparing", label: "Preparing Order", color: "bg-yellow-100 text-yellow-800", icon: Package },
    { id: "ready", label: "Order Ready", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
    { id: "waiting_rider", label: "Waiting for Rider", color: "bg-orange-100 text-orange-800", icon: Clock },
    { id: "picked_up", label: "Picked up by Rider", color: "bg-indigo-100 text-indigo-800", icon: Truck },
    { id: "out_for_delivery", label: "Out for Delivery", color: "bg-blue-100 text-blue-800", icon: Truck },
    { id: "delivered", label: "Delivered", color: "bg-green-100 text-green-800", icon: MapPin },
  ],
  pickup: [
    { id: "received", label: "Order Received", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    { id: "confirmed", label: "Order Confirmed", color: "bg-green-100 text-green-800", icon: CheckCircle },
    { id: "preparing", label: "Preparing Order", color: "bg-yellow-100 text-yellow-800", icon: Package },
    { id: "ready", label: "Ready for Pickup", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
    { id: "completed", label: "Order Completed", color: "bg-green-100 text-green-800", icon: MapPin },
  ],
};

export default function OrderManagement() {
  const { orders, updateOrderStatus: updateContextOrderStatus, refreshOrders } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerPhone && order.customerPhone.includes(searchQuery))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.currentStatus === statusFilter);
    }

    if (deliveryTypeFilter !== "all") {
      filtered = filtered.filter(order => order.deliveryType === deliveryTypeFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, deliveryTypeFilter]);

  const getStatusInfo = (status: string, deliveryType: "delivery" | "pickup") => {
    const statuses = ORDER_STATUSES[deliveryType];
    return statuses.find(s => s.id === status) || statuses[0];
  };

  const getNextStatus = (currentStatus: string, deliveryType: "delivery" | "pickup") => {
    const statuses = ORDER_STATUSES[deliveryType];
    const currentIndex = statuses.findIndex(s => s.id === currentStatus);
    return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : null;
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    updateContextOrderStatus(orderId, newStatus);

    // Update selected order if viewing details
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { 
        ...prev, 
        currentStatus: newStatus,
        estimatedCompletionTime: new Date(Date.now() + getEstimatedTime(newStatus) * 60 * 1000)
      } : null);
    }
  };

  const handleRefreshOrders = async () => {
    setIsLoading(true);
    try {
      await refreshOrders();
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getOrderStats = () => {
    const total = orders.length;
    const preparing = orders.filter(o => ["preparing", "confirmed"].includes(o.currentStatus)).length;
    const ready = orders.filter(o => o.currentStatus === "ready").length;
    const inTransit = orders.filter(o => ["waiting_rider", "picked_up", "out_for_delivery"].includes(o.currentStatus)).length;
    
    return { total, preparing, ready, inTransit };
  };

  const stats = getOrderStats();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-600">Track and manage all customer orders</p>
        </div>
        <Button onClick={handleRefreshOrders} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Preparing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.preparing}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ready</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ready}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or phone..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="received">Received</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="waiting_rider">Waiting for Rider</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={deliveryTypeFilter}
              onChange={(e) => setDeliveryTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Order</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.currentStatus, order.deliveryType);
                const nextStatus = getNextStatus(order.currentStatus, order.deliveryType);

                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">GHC {order.total.toFixed(2)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {order.deliveryType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-600">{getTimeAgo(order.createdAt)}</p>
                        <p className="text-xs text-gray-500">ETA: {formatTime(order.estimatedCompletionTime)}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {nextStatus && (
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => updateOrderStatus(order.id, nextStatus.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Next
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOrderDetails(false)}
                >
                  ×
                </Button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Time</p>
                  <p className="font-medium">{formatTime(selectedOrder.createdAt)}</p>
                </div>
                {selectedOrder.customerAddress && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{selectedOrder.customerAddress}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Estimated Completion</p>
                  <p className="font-medium">{formatTime(selectedOrder.estimatedCompletionTime)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">GHC {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t font-bold">
                  <span>Total</span>
                  <span>GHC {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ORDER_STATUSES[selectedOrder.deliveryType].map((status) => (
                    <Button
                      key={status.id}
                      size="sm"
                      variant={selectedOrder.currentStatus === status.id ? "default" : "outline"}
                      className={selectedOrder.currentStatus === status.id ? "bg-orange-500 hover:bg-orange-600" : ""}
                      onClick={() => updateOrderStatus(selectedOrder.id, status.id)}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}