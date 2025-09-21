export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  addOns: string[];
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "out-for-delivery" | "delivered" | "cancelled";
  orderType: "delivery" | "pickup";
  paymentMethod: "cash" | "card" | "mobile-money";
  paymentStatus: "pending" | "paid" | "refunded";
  orderTime: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  preparing: number;
  ready: number;
  outForDelivery: number;
  delivered: number;
}

export interface OrderFiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
}