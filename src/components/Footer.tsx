import React from "react";
import Image from "next/image";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-black text-[#FFEAD7] flex flex-col px-2 py-3 ${className}`}>
      {/*Buddies Inn logo section*/}
      <div className="">
        <Image src="/logo.png" alt="Buddies Inn logo" width={65} height={60} />
        {/*Horizontal Line*/}
        <hr className="border-1 border-white my-1"></hr>
        {/*Copyright*/}
        <div className="text-center text-xs">
          <p className="text-center align-center bg-black">
            &copy; 2025 Buddies Inn
          </p>
        </div>
        {/*Policy Links*/}
        <div className="flex flex-wrap justify-center gap-x-3 text-xs font-medium">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">License</a>
          <a href="#">Cookie</a>
          <a href="#">Policy</a>
          <a href="#">English</a>
        </div>
        {/*Software Engeneering logo*/}
        <div className="justify-center items-center flex mb-0 mt-4 ">
          <Image
            src="/softwareAlpha.png"
            alt="Software Alpha Logo"
            width={70}
            height={70}
            className="opacity-80  "
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
