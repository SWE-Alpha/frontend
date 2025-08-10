"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const images = ["/heroimg.png"];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      {/* Responsive logo at top left */}
      <div className="absolute top-0 left-0 ">
        <img
          src="/logo.png"
          alt="Buddies Inn Logo"
          className="h-10 md:h-15 lg:h-17 "
        />
      </div>
      {/* Hero image */}
      <img
        src={images[currentImageIndex]}
        alt="Hero"
        className="lg:w-full lg:h-120 md:h-110 md:w-full w-full sm:h-100 object bg-cover"
      />
    </div>
  );
};

export default HeroSection;
