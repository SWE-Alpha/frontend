"use client";

import { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

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
  const [showSuccess, setShowSuccess] = useState(false);

  // Extract first name from userName
  const getFirstName = () => {
    if (!formData.userName) return '';
    return formData.userName.split(' ')[0];
  };

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
    
    // Validate phone number
    const { validatePhoneNumber } = await import('@/lib/validation');
    const validationResult = validatePhoneNumber(number);
    
    if (!validationResult.isValid) {
      setError(validationResult.message || 'Invalid phone number format');
      return;
    }

    setIsLoading(true);
    try {
      await onRegister({
        userName,
        number,
        address: address || undefined
      });
      
      // Show success animation
      setShowSuccess(true);
      
      // Reset form and close modal after success animation
      setTimeout(() => {
        setFormData({
          userName: '',
          number: '',
          address: ''
        });
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading || showSuccess) return; // Prevent closing during loading or success
    setFormData({
      userName: '',
      number: '',
      address: ''
    });
    setError('');
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative p-6">
          {!showSuccess && (
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close registration"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
              <p className="text-gray-600 mb-2">
                Welcome to Buddies Inn{getFirstName() ? ` ${getFirstName()}` : ''}!
              </p>
              <p className="text-sm text-gray-500">You have been automatically signed in</p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            </div>
          ) : (
            // Registration Form
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <UserPlusIcon className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-600 mt-1">Join us to start ordering</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg animate-shake">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Enter your phone number (e.g., +233XXXXXXXXX or 0XXXXXXXXX)"
                    disabled={isLoading}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: +233XXXXXXXXX or 0XXXXXXXXX (Ghana numbers only)
                  </p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Enter your delivery address"
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
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {onSwitchToLogin && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={onSwitchToLogin}
                      className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                      disabled={isLoading}
                    >
                      Sign in
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