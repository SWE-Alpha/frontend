import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from './cart-context';
import { Toaster } from 'sonner';
import { CategoriesProvider } from "@/contexts/categoryContext";
import { ProductsProvider } from "@/contexts/productContext";
import { AuthProvider } from "@/contexts/authContext";
import { OrderProvider } from "@/contexts/orderTrackingContext";
import LayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Buddies Inn",
  description: "Snacks and beverages delivered to your doorstep. Experience the taste of excellence with Buddies Inn.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CategoriesProvider>
            <ProductsProvider>
              <CartProvider>
                <OrderProvider>
                  <LayoutClient>
                    <div className="flex-grow">
                      <Navbar />
                      <main className="min-h-[calc(100vh-200px)]">
                        {children}
                      </main>
                    </div>
                    <Footer className="mt-auto" />
                    <Toaster position="top-center" />
                  </LayoutClient>
                </OrderProvider>
              </CartProvider>
            </ProductsProvider>
          </CategoriesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}