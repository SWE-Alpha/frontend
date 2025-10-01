"use client";

import React, { useState, useMemo, useEffect } from "react";
import { syncCartToBackend } from "@/lib/cartApi";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCategories } from "@/contexts/categoryContext";
import { useProducts, Products } from "@/contexts/productContext";
import { Categories } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import Toast from "@/components/ui/toast";

const FoodOrderingApp = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Show toast if message is present in localStorage after redirect
  useEffect(() => {
    const msg = window.localStorage.getItem("app_toast");
    if (msg) {
      setToastMsg(msg);
      setShowToast(true);
      window.localStorage.removeItem("app_toast");
    }
  }, []);

  // Always auto-dismiss toast after 4 seconds when shown
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<{
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    addOns: {
      friedEgg: boolean;
      cheese: boolean;
      vegetable: boolean;
    };
    note: string;
    quantity: number;
    itemTotal: number;
  } | null>(null);

  const specialOffers = [
    { id: 1, title: "Special Offer 1", description: "Delicious meal combo" },
    { id: 2, title: "Limited Time Deal", description: "Family meal package" },
    {
      id: 3,
      title: "Weekend Special",
      description: "50% off on selected items",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const { categories } = useCategories();
  const { products } = useProducts();
  const { addToCart, cartItems } = useCart();
  // --- Checkout Modal State ---
  //const [showCheckout, setShowCheckout] = useState(false);
  //const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  // --- Checkout Handler ---
  // const handleCheckout = async () => {
  //   if (!isAuthenticated) {
  //     setShowLoginModal(true);
  //     return;
  //   }
  //   setShowCheckout(true);
  //   setIsPlacingOrder(true);
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) throw new Error("No auth token found");

  //     // Sync local cart to backend before placing order
  //     await syncCartToBackend(cartItems, token);
          

  //     console.log("Order customerName:", user?.userName);

  //     const orderPayload: CreateOrderRequest = {
  //       orderNumber: `ORD-${Date.now()}`,
  //       customerName: user?.userName || "User",
  //       subtotal: cartTotal,
  //       tax: 0,
  //       shipping: 7,
  //       discount: 0,
  //       total: cartTotal + 7,
  //       items: cartItems.map((item) => ({
  //         productId: item.id,
  //         name: item.name,
  //         quantity: item.quantity,
  //         price: item.price,
  //         total: item.itemTotal,
  //       })),
  //       shippingAddress: {
  //         firstName: "",
  //         lastName: "",
  //         address1: "",
  //         city: "",
  //         state: "",
  //         zipCode: "",
  //         country: "",
  //       },
  //     };
  //     const response = await createOrder(orderPayload, token);
  //     if (response.success) {
  //       clearCart();
  //       setShowCheckout(false);
  //       setIsPlacingOrder(false);
  //       toast.success("Order placed successfully!");
  //       setShowToast(true);
  //       // Optionally redirect or show order summary
  //     } else {
  //       throw new Error(response.message || "Order failed");
  //     }
  //   } catch (err) {
  //     setShowCheckout(false);
  //     setIsPlacingOrder(false);
  //     let message = "Unknown error";
  //     if (err instanceof Error) {
  //       message = err.message;
  //     }
  //     setToastMsg("Order failed: " + message);
  //     setShowToast(true);
  //   }
  // };
  const { isAuthenticated, isAdmin, login, register } = useAuth();
  const router = useRouter();

  // Redirect admin users to admin page
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push("/admin");
    }
  }, [isAuthenticated, isAdmin, router]);

  // Default active tab = first category
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].name);
    }
  }, [categories, activeTab]);

  // Authentication handlers
  const handleLogin = async (credentials: { number: string }) => {
    await login(credentials);
    setShowLoginModal(false);
    // Sync cart to backend after login
    const token = localStorage.getItem("authToken");
    if (token) {
      await syncCartToBackend(cartItems, token);
    }
    // Add the pending item to cart after successful login
    if (pendingCartItem) {
      addToCart(pendingCartItem);
      toast.success(`${pendingCartItem.name} added to cart!`);
      setPendingCartItem(null);
    }
  };

  const handleRegister = async (userData: {
    userName: string;
    number: string;
    address?: string;
  }) => {
    await register(userData);
    setShowRegisterModal(false);
    // Sync cart to backend after register
    const token = localStorage.getItem("authToken");
    if (token) {
      await syncCartToBackend(cartItems, token);
    }
    // Add the pending item to cart after successful registration
    if (pendingCartItem) {
      addToCart(pendingCartItem);
      toast.success(`${pendingCartItem.name} added to cart!`);
      setPendingCartItem(null);
    }
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleAddToCart = (item: Products) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the item to be added after authentication
      const cartItem = {
        id: item.id.toString(),
        name: item.name,
        price: parseFloat(item.price.toString()),
        image: item.images?.[0]?.url || "/placeholder.svg",
        category: item.category?.name || "Other",
        addOns: {
          friedEgg: false,
          cheese: false,
          vegetable: false,
        },
        note: "",
        quantity: 1,
        itemTotal: parseFloat(item.price.toString()),
      };
      setPendingCartItem(cartItem);
      setShowLoginModal(true);
      return;
    }

    // User is authenticated, add to cart directly
    const price = parseFloat(item.price.toString());
    addToCart({
      id: item.id.toString(),
      name: item.name,
      price: price,
      image: item.images?.[0]?.url || "/placeholder.svg",
      category: item.category?.name || "Other",
      addOns: {
        friedEgg: false,
        cheese: false,
        vegetable: false,
      },
      note: "",
      quantity: 1,
      itemTotal: price,
    });
    toast.success(`${item.name} added to cart!`);
  };

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === specialOffers.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [specialOffers.length]);

  // Filter by active tab
  const categoryProducts: Products[] = useMemo(() => {
    if (!activeTab) return [];
    return products.filter((product) => product.category?.name === activeTab);
  }, [products, activeTab]);

  // Search across all products
  const filteredItems: Products[] = useMemo(() => {
    if (!searchQuery.trim()) return categoryProducts;

    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery, categoryProducts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");

  return (
    <div className="w-full bg-white">

      {/* Checkout Modal */}
      {/* {showCheckout && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center p-6 max-w-sm w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Order...</h2>
            <p className="text-gray-600">Please wait while we prepare your order</p>
          </div>
        </div>
      )} */}

      <Toast
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Admin Button - Only show for authenticated admin users */}
      {isAuthenticated && isAdmin && (
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={() => router.push("/admin")}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Button>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 py-3 bg-orange-500">
        <div className="mb-3">
          <h1 className="text-xl font-bold text-white">Hi There!</h1>
          <p className="text-sm text-white/90">
            What would you like to order today?
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search for food..."
              className="bg-white border-0 rounded-lg pr-10"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 px-3">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Today's Special Offer - Hide when searching */}
      {!searchQuery && (
        <div className="px-4 py-6 relative">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Today&apos;s Special Offers
          </h2>
          <div className="relative h-64 overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {specialOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="w-full flex-shrink-0 h-64 bg-gray-100 rounded-xl overflow-hidden relative"
                >
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-50 to-orange-100">
                    <div className="text-center p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{offer.description}</p>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        Order Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === 0 ? specialOffers.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-orange-500" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % specialOffers.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-orange-500" />
            </button>
          </div>
        </div>
      )}

      {/* Menu Tabs */}
      {!searchQuery && categories.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Menu</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((tab: Categories) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.name ? "default" : "outline"}
                className={`rounded-full px-6 flex-shrink-0 ${
                  activeTab === tab.name
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold">
            Search Results for &quot;{searchQuery}&quot; ({filteredItems.length}{" "}
            items)
          </h2>
        </div>
      )}

      {/* Products Grid */}
      <div className="px-4 pb-20">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="block bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/products/${item.id}`)}
              >
                {/* Image */}
                <div className="relative w-full aspect-[3/2] bg-gray-100">
                  {item.images.length > 0 ? (
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Image
                        src="/placeholder.svg"
                        alt={item.name}
                        width={100}
                        height={100}
                        className="opacity-30"
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900">
                    {item.name}
                  </h3>
                  {item.category && (
                    <span className="text-[11px] text-orange-500 font-medium mb-1 block">
                      {item.category.name}
                    </span>
                  )}
                  <p className="text-[11px] text-gray-500 mb-2 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price + Button */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      GHC {Number(item.price).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 h-6 text-[11px]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No items found for &quot;{searchQuery}&quot;
            </p>
            <Button
              variant="outline"
              onClick={clearSearch}
              className="mt-2 bg-transparent"
            >
              Clear Search
            </Button>
          </div>
        ) : null}
      </div>

      {/* Checkout Button (visible if cart has items) */}
      {/* {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 px-4 py-3 flex justify-center">
          <Button
            className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
            onClick={handleCheckout}
            disabled={isPlacingOrder}
          >
            {isAuthenticated ? `Checkout - GHC ${(cartTotal + 7).toFixed(2)}` : 'Sign in to Checkout'}
          </Button>
        </div>
      )} */}

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      <FoodOrderingApp />
    </main>
  );
};

export default Home;
