import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import { CartProvider } from './cart-context';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "E-commerce Frontend",
  description: "Modern e-commerce application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <div className="flex-grow">
            <HeroSection />
            <Navbar />
            <main className="min-h-[calc(100vh-200px)]">
              {children}
            </main>
          </div>
          <Footer className="mt-auto" />
          <Toaster position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}
