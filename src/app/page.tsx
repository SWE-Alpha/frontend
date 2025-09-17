"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCategories } from "@/contexts/categoryContext";
import { useProducts, Products } from "@/contexts/productContext";
import { Categories } from "@/data/mockData";
import Navbar from "@/components/Navbar";

const FoodOrderingApp = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const specialOffers = [
    { id: 1, title: "Special Offer 1", description: "Delicious meal combo" },
    { id: 2, title: "Limited Time Deal", description: "Family meal package" },
    { id: 3, title: "Weekend Special", description: "50% off on selected items" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const { categories } = useCategories();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const router = useRouter();

  // Default active tab = first category
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].name);
    }
  }, [categories, activeTab]);

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
      {/* Navbar now holds search bar */}
      <Navbar
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
      />

      {/* Special Offers */}
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
