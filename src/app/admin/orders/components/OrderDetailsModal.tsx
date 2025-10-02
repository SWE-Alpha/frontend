import React from "react";
import { User, MapPin, Phone, Truck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "../types";
import { getStatusColor } from "../utils";

interface OrderDetailsModalProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onUpdateStatus: _onUpdateStatus,
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="customer">Customer Info</TabsTrigger>
          <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order Number:</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Time:</span>
                    <span>
                      {new Date(order.orderTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Type:</span>
                    <span className="capitalize">{order.orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={`${getStatusColor(order.status)} border-0`}>
                      {order.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <Badge
                      variant={order.paymentStatus === "paid" ? "default" : "secondary"}
                      className={
                        order.paymentStatus === "paid" ? "bg-green-500 hover:bg-green-600" : ""
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>GHS {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          {item.addOns.length > 0 && (
                            <p className="text-xs text-gray-500">
                              Add-ons: {item.addOns.join(", ")}
                            </p>
                          )}
                          {item.note && (
                            <p className="text-xs text-gray-500 italic">Note: {item.note}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">GHS {Number(item.price).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            Total: GHS {(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Name:</span>
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Phone:</span>
                  <span>{order.customerPhone}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="text-sm text-gray-600">{order.customerAddress}</p>
                  </div>
                </div>
              </div>
            </div>
            {order.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm">
                  <span className="font-medium">Customer Notes:</span> {order.notes}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Order Tracking
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.orderTime).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {order.status !== "new" && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-gray-600">Order has been confirmed</p>
                  </div>
                </div>
              )}

              {["in_progress", "fulfilled", "out-for-delivery", "delivered"].includes(order.status) && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Preparing</p>
                    <p className="text-sm text-gray-600">Your order is being prepared</p>
                  </div>
                </div>
              )}

              {["ready", "out-for-delivery", "delivered"].includes(order.status) && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Ready</p>
                    <p className="text-sm text-gray-600">Order is ready for pickup/delivery</p>
                  </div>
                </div>
              )}

              {order.orderType === "delivery" && ["out-for-delivery", "delivered"].includes(order.status) && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Out for Delivery</p>
                    <p className="text-sm text-gray-600">Order is on the way</p>
                    <p className="text-xs text-gray-500">
                      Est. delivery: {new Date(order.estimatedDelivery).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {order.status === "delivered" && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-gray-600">Order has been delivered successfully</p>
                  </div>
                </div>
              )}

              {order.status === "cancelled" && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Cancelled</p>
                    <p className="text-sm text-gray-600">Order has been cancelled</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetailsModal;