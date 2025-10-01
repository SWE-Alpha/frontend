"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/cart-context";
import { useAuth } from "@/contexts/authContext";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, login, register, logout } = useAuth();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogin = async (credentials: { number: string }) => {
    await login(credentials);
    setShowLoginModal(false);
  };

  const handleRegister = async (userData: { userName: string; number: string; address?: string }) => {
    await register(userData);
    setShowRegisterModal(false);
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const navItems = [{ icon: HomeIcon, label: "Home", href: "/" }];

  return (
    <>
      <nav className="flex justify-between items-center px-4 py-3 bg-gray-50 shadow-lg">
        {/* Logo Left */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="font-bold text-gray-800 text-lg">Buddies Inn</span>
        </div>


        {/* Cart + Menu Right */}
        <div className="flex items-center space-x-4">
          {/* Hide cart icon on /admin routes */}
          {!(pathname && pathname.startsWith("/admin")) && (
            <Link href="/cart" className="relative">
              <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}
          <button onClick={toggleDrawer} className="p-1" aria-label="Open menu">
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Sidebar Drawer (from right) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
      >
        <div
          className={`fixed right-0 top-0 h-full w-[280px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isAuthenticated ? user?.userName || 'User' : 'Buddies Inn'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isAuthenticated ? (isAdmin ? 'Admin User' : 'Welcome back!') : 'Please sign in'}
                  </p>
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
                      className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-50 w-full"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              
              {/* Authentication Section */}
              <li className="border-t border-gray-200 pt-3 mt-3">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-left"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        setShowRegisterModal(true);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left mt-1"
                    >
                      <UserIcon className="w-5 h-5 mr-3" />
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    {/* Show admin dashboard link for admin users */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors w-full mb-1"
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        <Cog6ToothIcon className="w-5 h-5 mr-3" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsDrawerOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                      Sign Out
                    </button>
                  </>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={switchToRegister}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

export default Navbar;
