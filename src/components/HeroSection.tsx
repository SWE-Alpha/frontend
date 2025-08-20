"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const images = ["/heroimg.png"];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      {/* Responsive logo at top left */}
      <div className="absolute top-0 left-0 z-10">
        <Image
          src="/logo.png"
          alt="Buddies Inn Logo"
          width={120}
          height={60}
          className="h-10 md:h-15 lg:h-17 w-auto"
          priority
        />
      </div>
      {/* Hero image */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src={images[currentImageIndex]}
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default HeroSection;
