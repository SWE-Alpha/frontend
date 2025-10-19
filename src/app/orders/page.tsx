"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin,
  Eye,
  Search,
  Filter
} from "lucide-react";
import { useOrders } from "@/contexts/orderTrackingContext";
import { useAuth } from "@/contexts/authContext";
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

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useOrders();
  const { user, isAuthenticated } = useAuth();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // Filter orders based on user and filters
  useEffect(() => {
    if (!user) return;

    let userOrders = orders.filter(order => 
      order.customerName === user.userName || 
      order.customerPhone === user.number
    );

    // Filter by active/completed
    if (activeTab === "active") {
      userOrders = userOrders.filter(order => 
        !["delivered", "completed"].includes(order.currentStatus)
      );
    } else {
      userOrders = userOrders.filter(order => 
        ["delivered", "completed"].includes(order.currentStatus)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      userOrders = userOrders.filter(order => order.currentStatus === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      userOrders = userOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort by creation date (newest first)
    userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredOrders(userOrders);
  }, [orders, user, statusFilter, searchTerm, activeTab]);

  const getStatusInfo = (status: string, deliveryType: "delivery" | "pickup") => {
    const statuses = ORDER_STATUSES[deliveryType];
    return statuses.find(s => s.id === status) || statuses[0];
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getEstimatedTimeRemaining = (order: Order) => {
    if (["delivered", "completed"].includes(order.currentStatus)) {
      return "Completed";
    }

    const now = new Date();
    const estimatedTime = new Date(order.estimatedCompletionTime);
    const timeDiff = estimatedTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return "Ready soon";
    }

    const minutes = Math.floor(timeDiff / (1000 * 60));
    if (minutes < 60) return `${minutes}m remaining`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m remaining`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in to View Orders</h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your order history and track your orders.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push("/")} 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Go to Menu
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
              <p className="text-sm text-gray-600">
                {user?.userName && `Welcome back, ${user.userName}`}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <Button
              variant={activeTab === "active" ? "default" : "ghost"}
              onClick={() => setActiveTab("active")}
              className={activeTab === "active" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Active Orders
            </Button>
            <Button
              variant={activeTab === "completed" ? "default" : "ghost"}
              onClick={() => setActiveTab("completed")}
              className={activeTab === "completed" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Order History
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by order number or item name..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
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
                <option value="out_for_delivery">Out for Delivery</option>
                {activeTab === "completed" && (
                  <>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {activeTab === "active" ? "No Active Orders" : "No Order History"}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === "active" 
                  ? "You don't have any active orders right now." 
                  : "You haven't completed any orders yet."}
              </p>
              <Button 
                onClick={() => router.push("/")} 
                className="bg-orange-500 hover:bg-orange-600"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.currentStatus, order.deliveryType);
                const IconComponent = statusInfo.icon;

                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={statusInfo.color}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {getEstimatedTimeRemaining(order)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {order.deliveryType}
                        </Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.items.slice(0, 2).map(item => item.name).join(", ")}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-lg">GHC {order.total.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 ml-2">{getTimeAgo(order.createdAt)}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Track Order
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}