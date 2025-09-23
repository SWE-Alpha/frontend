"use client";
import { useEffect, useState } from "react";

export default function Toast({
  message,
  show,
  onClose,
  duration = 4000, // default 4s
}: {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);

      // Stay for `duration`, then hide
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  // When animation finishes and it's hidden → call onClose
  const handleAnimationEnd = () => {
    if (!visible) {
      onClose();
    }
  };

  if (!show && !visible) return null;

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50
        bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold
        ${visible ? "animate-fade-in" : "animate-fade-out"}`}
    >
      {message}
    </div>
  );
}
