"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle, Package, Truck, MapPin } from "lucide-react";
import { useOrders } from "@/contexts/orderTrackingContext";
import type { Order } from "@/contexts/orderTrackingContext";

interface OrderStatus {
  id: string;
  label: string;
  timestamp?: Date;
  estimatedTime?: string;
  icon: any;
}

const ORDER_STATUSES = {
  delivery: [
    { id: "received", label: "Order Received", icon: CheckCircle },
    { id: "confirmed", label: "Order Confirmed", icon: CheckCircle },
    { id: "preparing", label: "Preparing Order", icon: Package },
    { id: "ready", label: "Order Ready", icon: CheckCircle },
    { id: "waiting_rider", label: "Waiting for Rider", icon: Clock },
    { id: "picked_up", label: "Picked up by Rider", icon: Truck },
    { id: "out_for_delivery", label: "Out for Delivery", icon: Truck },
    { id: "delivered", label: "Delivered", icon: MapPin },
  ],
  pickup: [
    { id: "received", label: "Order Received", icon: CheckCircle },
    { id: "confirmed", label: "Order Confirmed", icon: CheckCircle },
    { id: "preparing", label: "Preparing Order", icon: Package },
    { id: "ready", label: "Ready for Pickup", icon: CheckCircle },
    { id: "completed", label: "Order Completed", icon: MapPin },
  ],
};

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { getOrderById } = useOrders();

  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Load order from context
  useEffect(() => {
    const order = getOrderById(orderId);
    if (order) {
      setOrderDetails(order);
      setLoading(false);
    } else {
      // If not found in context, maybe it's a fresh page load, try localStorage
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            estimatedCompletionTime: new Date(order.estimatedCompletionTime),
          }));
          const foundOrder = parsedOrders.find((order: Order) => order.id === orderId);
          if (foundOrder) {
            setOrderDetails(foundOrder);
          }
        } catch (error) {
          console.error('Error parsing saved orders:', error);
        }
      }
      setLoading(false);
    }
  }, [orderId, getOrderById]);

  // Update countdown timer
  useEffect(() => {
    if (!orderDetails) return;

    const updateTimer = () => {
      const now = new Date();
      const timeDiff = orderDetails.estimatedCompletionTime.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setTimeRemaining("Order should be ready!");
        return;
      }

      const minutes = Math.floor(timeDiff / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [orderDetails]);

  const getOrderStatuses = (deliveryType: "delivery" | "pickup") => {
    return ORDER_STATUSES[deliveryType];
  };

  const getStatusIndex = (currentStatus: string, statuses: OrderStatus[]) => {
    return statuses.findIndex(status => status.id === currentStatus);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const statuses = getOrderStatuses(orderDetails.deliveryType);
  const currentStatusIndex = getStatusIndex(orderDetails.currentStatus, statuses);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Track Your Order</h1>
            <p className="text-gray-600">Order #{orderDetails.orderNumber}</p>
          </div>
        </div>

        {/* Estimated Time Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {orderDetails.deliveryType === "delivery" ? "Estimated Delivery Time" : "Estimated Pickup Time"}
              </h3>
              <p className="text-gray-600">
                {formatTime(orderDetails.estimatedCompletionTime)}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-orange-500 mb-1">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-lg font-semibold">{timeRemaining}</span>
              </div>
              <p className="text-sm text-gray-500">Time remaining</p>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Order Progress</h3>
          
          <div className="space-y-4">
            {statuses.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const IconComponent = status.icon;

              return (
                <div key={status.id} className="flex items-center">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-orange-500 text-white animate-pulse'
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <p className={`font-medium ${
                      isCompleted ? 'text-green-600' : isCurrent ? 'text-orange-600' : 'text-gray-400'
                    }`}>
                      {status.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-gray-500">In progress...</p>
                    )}
                    {isCompleted && index < currentStatusIndex && (
                      <p className="text-sm text-gray-500">Completed</p>
                    )}
                  </div>

                  {index < statuses.length - 1 && (
                    <div className={`absolute left-5 mt-10 w-0.5 h-8 ${
                      index < currentStatusIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`} style={{ marginLeft: '1.25rem' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
          
          <div className="space-y-3 mb-6">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-800">GHC {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Delivery Type:</p>
              <p className="font-medium capitalize">{orderDetails.deliveryType}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Order Time:</p>
              <p className="font-medium">{formatTime(orderDetails.createdAt)}</p>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
              <p>Total:</p>
              <p>GHC {orderDetails.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => router.push("/orders")}
          >
            View All Orders
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}