"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Home, Package, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { OrdersProvider } from "@/contexts/orderContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, logout, isLoading } = useAuth();

  // Admin authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render admin layout if user is not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 px-4 bg-orange-600">
            <h1 className="text-xl font-bold text-white">Buddies Inn Admin</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
            <nav className="flex-1 space-y-1">
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <Home className="w-5 h-5 mr-3 text-gray-500 group-hover:text-orange-500" />
                Dashboard
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <Package className="w-5 h-5 mr-3 text-gray-500 group-hover:text-orange-500" />
                Orders
              </Link>
              <Link
                href="/admin/menu"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <Package className="w-5 h-5 mr-3 text-gray-500 group-hover:text-orange-500" />
                Menu Management
              </Link>
              <Link
                href="/admin/customers"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <Users className="w-5 h-5 mr-3 text-gray-500 group-hover:text-orange-500" />
                Customers
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <Settings className="w-5 h-5 mr-3 text-gray-500 group-hover:text-orange-500" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-red-600 rounded-lg hover:bg-red-50 group"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <h1 className="text-lg font-semibold text-gray-900">Buddies Inn Admin</h1>
          <button
            onClick={handleLogout}
            className="p-1 text-gray-400 hover:text-gray-500"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </header>

        {/* Page content */}
        <OrdersProvider>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </OrdersProvider>
      </div>
    </div>
  );
}
