"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, CheckCircle, Truck, Package, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  total: number;
  orderTime: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    outForDelivery: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const router = useRouter();

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Simulate API call
    const loadData = () => {
      setStats({
        totalOrders: 124,
        pending: 8,
        preparing: 12,
        ready: 4,
        outForDelivery: 5,
      });

      setRecentOrders([
        {
          id: "1",
          orderNumber: "ORD-00123",
          customerName: "John Doe",
          status: "preparing",
          total: 65.0,
          orderTime: new Date().toISOString(),
        },
        {
          id: "2",
          orderNumber: "ORD-00122",
          customerName: "Jane Smith",
          status: "pending",
          total: 32.5,
          orderTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "3",
          orderNumber: "ORD-00121",
          customerName: "Michael Johnson",
          status: "ready",
          total: 48.75,
          orderTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
      ]);
    };

    loadData();
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case "preparing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Package className="w-3 h-3 mr-1" /> Preparing
          </span>
        );
      case "ready":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Ready
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Truck className="w-3 h-3 mr-1" /> Out for Delivery
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders */}
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-50 text-orange-600">
              <Package className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Total Orders</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Pending</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Preparing Orders */}
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-50 text-orange-600">
              <Package className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Preparing</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.preparing}</p>
            </div>
          </div>
        </div>

        {/* Ready for Pickup/Delivery */}
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">Ready</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.ready}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <Link 
            href="/admin/orders" 
            className="text-sm font-medium text-orange-600 hover:text-orange-500 flex items-center"
          >
            View all orders
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <li key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="font-medium text-gray-900">
                      {order.orderNumber}
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">GHS {order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/orders/new"
            className="flex flex-col items-center justify-center p-6 space-y-3 text-center bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="p-3 rounded-full bg-orange-50 text-orange-600">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Create New Order</h3>
            <p className="text-sm text-gray-500">Manually create a new order for a customer</p>
          </Link>

          <Link
            href="/admin/menu"
            className="flex flex-col items-center justify-center p-6 space-y-3 text-center bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Manage Menu</h3>
            <p className="text-sm text-gray-500">Add, edit, or remove menu items</p>
          </Link>

          <Link
            href="/admin/customers"
            className="flex flex-col items-center justify-center p-6 space-y-3 text-center bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">View Customers</h3>
            <p className="text-sm text-gray-500">Manage customer information</p>
          </Link>

          <Link
            href="/admin/reports"
            className="flex flex-col items-center justify-center p-6 space-y-3 text-center bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">View Reports</h3>
            <p className="text-sm text-gray-500">Analyze sales and performance</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
