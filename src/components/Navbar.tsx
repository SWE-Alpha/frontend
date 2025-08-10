"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart-context";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import AdminLoginModal from "./AdminLoginModal";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { cartCount } = useCart();
  const router = useRouter();

  const handleAdminLogin = async (username: string, password: string) => {
    // TODO: Implement actual authentication
    // For now, just log in with any credentials
    console.log('Logging in with:', { username });
    // Store the auth state (in a real app, you'd use a proper auth context)
    localStorage.setItem('isAdminAuthenticated', 'true');
    // Close the modal
    setIsLoginModalOpen(false);
    // Redirect to admin dashboard
    router.push('/admin/dashboard');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const navItems = [
    { icon: HomeIcon, label: 'Home', href: '/' },
    { icon: Cog6ToothIcon, label: 'Settings', href: '#' },
    { icon: QuestionMarkCircleIcon, label: 'Help & Support', href: '#' },
  ];

  const adminButton = {
    icon: UserIcon,
    label: 'Admin Login',
    href: '/admin/login',
    className: 'mt-4 border-t border-gray-100 pt-4',
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 py-3 bg-white shadow-sm">
        <button onClick={toggleDrawer} className="p-1">
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1">
            <BellIcon className="w-6 h-6 text-gray-700" />
          </button>
          <Link href="/cart" className="relative">
            <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Sidebar Drawer */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleDrawer}
      >
        <div 
          className={`fixed left-0 top-0 h-full w-[280px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Buddies Inn</h2>
                  <p className="text-sm text-gray-500">Welcome back!</p>
                </div>
              </div>
              <button 
                onClick={toggleDrawer} 
                className="p-1 hover:bg-gray-50 rounded-full"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-50`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              
              {/* Admin Login Button */}
              <li className={adminButton.className}>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-left"
                >
                  <adminButton.icon className="w-5 h-5 mr-3" />
                  {adminButton.label}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleAdminLogin}
      />
    </>
  );
};

export default Navbar;
