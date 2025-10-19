"use client";

import { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, UserIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  userName: string;
  number: string;
  address?: string;
  isAdmin?: boolean;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { number: string }) => Promise<void>;
  onSwitchToRegister?: () => void;
  user?: User | null;
}

export default function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister, user }: LoginModalProps) {
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Extract first name from userName
  const getFirstName = () => {
    if (!user?.userName) return '';
    return user.userName.split(' ')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!number) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin({ number });
      
      // Show success animation
      setShowSuccess(true);
      
      // Reset form and close modal after success animation
      setTimeout(() => {
        setNumber('');
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid phone number';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading || showSuccess) return; // Prevent closing during loading or success
    setNumber('');
    setError('');
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="relative p-6">
          {!showSuccess && (
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close login"
              disabled={isLoading}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
          
          {showSuccess ? (
            // Success State
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back{getFirstName() ? ` ${getFirstName()}` : ''}!
              </h2>
              <p className="text-gray-600">You have successfully signed in</p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            </div>
          ) : (
            // Login Form
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600 mt-1">Sign in to place your order</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="number"
                    type="tel"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Enter your phone number"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {onSwitchToRegister && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={onSwitchToRegister}
                      className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                      disabled={isLoading}
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}