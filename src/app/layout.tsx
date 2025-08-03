import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

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
      <body>
        <HeroSection />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
