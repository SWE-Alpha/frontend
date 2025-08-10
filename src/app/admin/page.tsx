"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a placeholder for the admin dashboard
// In a real app, you would check authentication status here
// and redirect to login if not authenticated

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to the Admin Panel</h2>
          <p className="text-gray-600">This is a placeholder for the admin dashboard.</p>
          <p className="text-gray-600 mt-2">You can manage your menu, orders, and settings from here.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <h3 className="text-lg font-medium text-orange-800">Menu Management</h3>
              <p className="mt-2 text-sm text-orange-700">Add, edit, or remove menu items</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800">Orders</h3>
              <p className="mt-2 text-sm text-blue-700">View and manage customer orders</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium text-green-800">Analytics</h3>
              <p className="mt-2 text-sm text-green-700">View sales and customer insights</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                localStorage.removeItem('isAdminAuthenticated');
                router.push('/');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
