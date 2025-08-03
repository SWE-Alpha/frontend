import React from "react";
import Image from "next/image";
import {
  Bars3Icon,
  BellIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-white shadow">
      {/* Menu */}
      <div>
        <Bars3Icon className="w-6 h-6 text-black" />
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        <BellIcon className="w-6 h-6 text-black" />
        <div className="relative">
          <ShoppingCartIcon className="w-6 h-6 text-black" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
