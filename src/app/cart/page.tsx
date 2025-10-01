"use client";

import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../cart-context";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Toast from "@/components/ui/toast";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import { createOrder, CreateOrderRequest } from "@/lib/api";
import { syncCartToBackend } from "@/lib/cartApi";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();
  const { user, isAuthenticated, login, register } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  //const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateCartItem(id, { quantity: newQuantity });
    }
  };

  const getAddOnsList = (addOns: {
    friedEgg: boolean;
    cheese: boolean;
    vegetable: boolean;
  }) => {
    const activeAddOns = Object.entries(addOns)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => {
        switch (key) {
          case "friedEgg":
            return "Fried Egg";
          case "cheese":
            return "Cheese";
          case "vegetable":
            return "Vegetable";
          default:
            return key;
        }
      });
    return activeAddOns.length > 0 ? activeAddOns.join(", ") : "No add-ons";
  };

  // const handleCheckout = () => {
  //   // Check if user is authenticated before proceeding
  //   if (!isAuthenticated) {
  //     setShowLoginModal(true);
  //     return;
  //   }

  //   setShowCheckout(true);
  //   // Simulate order processing
  //   setTimeout(() => {
  //     clearCart();
  //     setShowCheckout(false);
  //     // Store toast message in localStorage before redirect
  //     window.localStorage.setItem("app_toast", "Order placed successfully!");
  //     router.push("/");
  //   }, 2000);
  // };


  // Checkout logic from app/page.tsx, using cart page's toaster
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowCheckout(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      // Sync local cart to backend before placing order
      await syncCartToBackend(cartItems, token);

      // Debug: log user and user.userName
      console.log("user object at checkout:", user);
      console.log("user.userName at checkout:", user?.userName);

      const orderPayload: CreateOrderRequest = {
        orderNumber: `ORD-${Date.now()}`,
        customerName: user?.userName || "User",
        subtotal: cartTotal,
        tax: 0,
        shipping: 7,
        discount: 0,
        total: cartTotal + 7,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.itemTotal,
        })),
        shippingAddress: {
          firstName: "",
          lastName: "",
          address1: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      };
      const response = await createOrder(orderPayload, token);
      if (response.success) {
        console.log("Username:", user?.userName);
        console.log("Order created:", response.data);
        clearCart();
        setShowCheckout(false);
        setToastMsg("Order placed successfully!");
        setShowToast(true);
        // Redirect
        setTimeout(() => {
          router.push("/");
        }, 1500);
        setShowToast(true);
      } else {
        throw new Error(response.message || "Order failed");
      }
    } catch (err) {
      setShowCheckout(false);
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      }
      setToastMsg("Order failed: " + message);
      setShowToast(true);
    }
  };

  // end



  const handleLogin = async (credentials: { number: string }) => {
    await login(credentials);
    setShowLoginModal(false);
    // After successful login, proceed with checkout
    handleCheckout();
  };

  const handleRegister = async (userData: {
    userName: string;
    number: string;
    address?: string;
  }) => {
    await register(userData);
    setShowRegisterModal(false);
    // After successful registration, proceed with checkout
    handleCheckout();
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Toast
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      
      {showCheckout ? (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center p-6 max-w-sm w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Order...</h2>
            <p className="text-gray-600">
              Please wait while we prepare your order
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Cart Header */}
          <div className="sticky top-0 z-10 bg-orange-500 px-4 py-3">
            <div className="flex items-center gap-4 max-w-4xl mx-auto">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-orange-600 p-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">Your Cart</h1>
                <p className="text-sm text-white/90">{cartCount} items</p>
              </div>
              {isAuthenticated && (
                <div className="text-right">
                  <p className="text-sm text-white/90">Welcome back,</p>
                  <p className="text-sm font-medium text-white">
                    {user?.userName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 px-4 py-4 max-w-4xl mx-auto w-full">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-6">
                  Add some delicious items to get started!
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Browse Menu
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-sm">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-600 mb-1">
                                {item.category}
                              </p>
                              <p className="text-xs text-orange-600">
                                {getAddOnsList(item.addOns)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {item.note && (
                            <p className="text-xs text-gray-500 mb-2 italic">
                              Note: {item.note}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-7 h-7 p-0 rounded-full bg-transparent"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-7 h-7 p-0 rounded-full bg-transparent"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <span className="font-semibold text-sm">
                              GHC {item.itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartCount} items)</span>
                      <span>GHC {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>GHC 5.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>GHC 2.00</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>GHC {(cartTotal + 7).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pb-6">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
                    onClick={handleCheckout}
                  >
                    {isAuthenticated
                      ? `Checkout - GHC ${(cartTotal + 7).toFixed(2)}`
                      : "Sign in to Checkout"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                    onClick={() => router.push("/")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={switchToRegister}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
}
