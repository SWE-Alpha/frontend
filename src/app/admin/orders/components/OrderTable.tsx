import React, { useState } from "react";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Order } from "../types";
import { getStatusColor, getStatusIcon } from "../utils";
import { OrderDetailsModal } from "./index";

interface OrderTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onUpdateStatus }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-gray-600">{order.customerPhone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </div>
              </TableCell>
              <TableCell className="font-semibold">GHS {order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(order.status)} border-0`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status.replace("-", " ")}
                  </div>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{order.orderType}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{order.paymentMethod}</div>
                  <Badge
                    variant={order.paymentStatus === "paid" ? "default" : "secondary"}
                    className={`text-xs ${
                      order.paymentStatus === "paid" ? "bg-green-500 hover:bg-green-600" : ""
                    }`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(order.orderTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <OrderDetailsModal
                          order={selectedOrder}
                          onUpdateStatus={onUpdateStatus}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "confirmed")}
                      >
                        Confirm Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "preparing")}
                      >
                        Start Preparing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "ready")}
                      >
                        Mark Ready
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "out-for-delivery")}
                      >
                        Out for Delivery
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "delivered")}
                      >
                        Mark Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onUpdateStatus(order.id, "cancelled")}
                      >
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {orders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;