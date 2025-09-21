"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { number: string }) => Promise<void>;
  onSwitchToRegister?: () => void;
}

export default function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister }: LoginModalProps) {
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Reset form on success
      setNumber('');
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid phone number';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNumber('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="relative p-6">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close login"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-1">Sign in to place your order</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your phone number"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {onSwitchToRegister && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}