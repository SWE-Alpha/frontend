import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from './cart-context';
import { Toaster } from 'sonner';
import { CategoriesProvider } from "@/contexts/categoryContext";
import { ProductsProvider } from "@/contexts/productContext";
import { AuthProvider } from "@/contexts/authContext";

export const metadata: Metadata = {
  title: "E-commerce Frontend",
  description: "Modern e-commerce application built with Next.js",
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
                <div className="flex-grow">
                  <Navbar />
                  <main className="min-h-[calc(100vh-200px)]">
                    {children}
                  </main>
                </div>
                <Footer className="mt-auto" />
                <Toaster position="top-center" />
              </CartProvider>
            </ProductsProvider>
          </CategoriesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}