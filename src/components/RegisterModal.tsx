"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (userData: {
    userName: string;
    number: string;
    address?: string;
  }) => Promise<void>;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ 
  isOpen, 
  onClose, 
  onRegister, 
  onSwitchToLogin 
}: RegisterModalProps) {
  const [formData, setFormData] = useState({
    userName: '',
    number: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { userName, number, address } = formData;
    
    if (!userName || !number) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await onRegister({
        userName,
        number,
        address: address || undefined
      });
      // Reset form on success
      setFormData({
        userName: '',
        number: '',
        address: ''
      });
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      userName: '',
      number: '',
      address: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative p-6">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close registration"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-1">Join us to start ordering</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your full name"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="number"
                name="number"
                type="tel"
                value={formData.number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your phone number"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address (Optional)
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your delivery address"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {onSwitchToLogin && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}