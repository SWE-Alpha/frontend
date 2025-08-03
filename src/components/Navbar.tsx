"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const navItems = [
    { icon: HomeIcon, label: 'Home', active: true },
    { icon: UserGroupIcon, label: 'About Us' },
    { icon: ShoppingBagIcon, label: 'Our Menu' },
    { icon: HeartIcon, label: 'Favorites' },
    { icon: Cog6ToothIcon, label: 'Settings' },
    { icon: QuestionMarkCircleIcon, label: 'Help & Support' },
    { icon: ArrowRightOnRectangleIcon, label: 'Sign Out' },
  ];

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
        
        <div className="w-6"></div> {/* Spacer for centering */}
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
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${item.active ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <item.icon className={`w-5 h-5 ${item.active ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
