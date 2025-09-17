import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "./cart-context";
import { Toaster } from "sonner";
import { CategoriesProvider } from "@/contexts/categoryContext";
import { ProductsProvider } from "@/contexts/productContext";
import React, { useState } from "react";

export const metadata: Metadata = {
  title: "E-commerce Frontend",
  description: "Modern e-commerce application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lifted search state
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CategoriesProvider>
          <ProductsProvider>
            <CartProvider>
              <div className="flex-grow">
                {/* Navbar with props */}
                <Navbar                />
                <main className="min-h-[calc(100vh-200px)]">
              {children}
            </main>
          </div>
          <Footer className="mt-auto" />
          
          <Toaster position="top-center" />
        
        </CartProvider>

         </ProductsProvider>

        </CategoriesProvider>
      </body>
    </html>
  );
}
