"use client";

import { useState } from 'react';
import ToastNotification from '@/components/ui/toast-notification';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    show: boolean;
  }>({
    message: '',
    type: 'info',
    show: false
  });

  // Make toast functions available globally
  if (typeof window !== 'undefined') {
    window.showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      setToast({ message, type, show: true });
    };
  }

  return (
    <>
      {children}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </>
  );
}