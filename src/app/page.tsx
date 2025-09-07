"use client";

import React, { useState, useMemo, useEffect } from "react"
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "./cart-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCategories } from "@/contexts/categoryContext"
import { useProducts, Products } from "@/contexts/productContext"
import { Categories } from "@/data/mockData"

const FoodOrderingApp = () => {
  const [activeTab, setActiveTab] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  const specialOffers = [
    {
      id: 1,
      title: "Special Offer 1",
      description: "Delicious meal combo",
      image: "/placeholder.svg?height=200&width=320",
    },
    {
      id: 2,
      title: "Limited Time Deal",
      description: "Family meal package",
      image: "/placeholder.svg?height=200&width=320",
    },
    {
      id: 3,
      title: "Weekend Special",
      description: "50% off on selected items",
      image: "/placeholder.svg?height=200&width=320",
    },
  ]
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const { categories } = useCategories()
  const { products } = useProducts()
  const { addToCart } = useCart()
  const router = useRouter()
  
  // Default active tab = first category
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].name)
    }
  }, [categories, activeTab])

  // Auto-slide every 5 seconds
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
    if (!activeTab) return []
    return products.filter((product) => product.category?.name === activeTab)
  }, [products, activeTab])

  // Search across all products
  const filteredItems: Products[] = useMemo(() => {
    if (!searchQuery.trim()) return categoryProducts

    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery, categoryProducts])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="w-full bg-white">
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

            {/* Navigation Arrows */}
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

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {specialOffers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentSlide ? "bg-orange-500 w-6" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Tabs - Hide when searching */}
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
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="block bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/products/${item.id}`)}
              >
                <div className="relative w-full aspect-[4/3] bg-gray-100">
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
                        width={150}
                        height={150}
                        className="opacity-30"
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {item.category && (
                    <span className="text-xs text-orange-500 font-medium mb-1 block">
                      {item.category.name}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">GHC {Number(item.price).toFixed(2)}</span>
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 h-7 text-xs"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const price = item.price

                        addToCart({
                          id: String(item.id),
                          name: item.name,
                          price: price,
                          image: item.images.length > 0 ? item.images[0].url : "/placeholder.svg",
                          category: item.category?.name || "Other",
                          quantity: 1,
                          addOns: {
                            friedEgg: false,
                            cheese: false,
                            vegetable: false,
                          },
                          note: "",
                          itemTotal: price,
                        })
                        
                        toast.success(`${item.name} added to cart!`)
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
