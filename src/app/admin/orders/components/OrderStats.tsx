import React from "react";
import { OrderStats as OrderStatsType } from "../types";

interface OrderStatsProps {
  stats: OrderStatsType;
}

const OrderStats: React.FC<OrderStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Orders</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        <div className="text-sm text-gray-600">Pending</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-2xl font-bold text-orange-600">{stats.preparing}</div>
        <div className="text-sm text-gray-600">Preparing</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-2xl font-bold text-purple-600">{stats.ready}</div>
        <div className="text-sm text-gray-600">Ready</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-2xl font-bold text-indigo-600">{stats.outForDelivery}</div>
        <div className="text-sm text-gray-600">Out for Delivery</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
        <div className="text-sm text-gray-600">Delivered</div>
      </div>
    </div>
  );
};

export default OrderStats;