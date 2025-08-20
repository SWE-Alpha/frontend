"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "./cart-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string; // Optional since not all items have category
}

const FoodOrderingApp = () => {
  const [activeTab, setActiveTab] = useState("Paninis")
  const [searchQuery, setSearchQuery] = useState("")

  const specialOffers = [
    { 
      id: 1, 
      title: "Special Offer 1",
      description: "Delicious meal combo",
      image: "/placeholder.svg?height=200&width=320" 
    },
    { 
      id: 2, 
      title: "Limited Time Deal",
      description: "Family meal package",
      image: "/placeholder.svg?height=200&width=320" 
    },
    { 
      id: 3, 
      title: "Weekend Special",
      description: "50% off on selected items",
      image: "/placeholder.svg?height=200&width=320" 
    },
  ]
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const { addToCart } = useCart()
  const router = useRouter()
  
  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === specialOffers.length - 1 ? 0 : prev + 1))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [specialOffers.length])

  const menuItems: Record<string, MenuItem[]> = {
    Paninis: [
      {
        id: 1,
        name: "Layman",
        description: "Egg, sausage, corn beef & Rose bread",
        price: "GHC 18.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 2,
        name: "Original",
        description: "Eggs, sausage, corn beef & Big bread",
        price: "GHC 25.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 3,
        name: "Puff daddy",
        description: "Eggs, sausages, corn beef, cheese & BB",
        price: "GHC 33.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 4,
        name: "Chairmoo",
        description: "Eggs, sausages, corn beef, cheese & BB",
        price: "GHC 38.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 5,
        name: "Legend",
        description: "Eggs, sausages, corn beef, cheese, chicken & BB",
        price: "GHC 45.00",
        image: "/placeholder.svg?height=100&width=150",
      },
    ],
    Hotdogs: [
      {
        id: 6,
        name: "Cherry Dog",
        description: "Relish, mustard, ketchup and raw onion",
        price: "GHC 25.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 7,
        name: "Chilli Dog",
        description: "Chilli sauce, mozzarella cheese, onions",
        price: "GHC 30.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 8,
        name: "Slaw Dog",
        description: "Cole slaw, sliced minced meat",
        price: "GHC 35.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 9,
        name: "Hoagie Dog",
        description: "Chilli sauce, mixed veg mayo and chicken/ minced meat",
        price: "GHC 40.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 10,
        name: "Buffalo Dog",
        description: "Chilli sauce, mixed veg, mayo and chicken and minced meat",
        price: "GHC 50.00",
        image: "/placeholder.svg?height=100&width=150",
      },
    ],
    Beverages: [
      {
        id: 11,
        name: "Yogurt juice",
        description: "Refreshing yogurt drink",
        price: "GHC 20.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 12,
        name: "Mango juice",
        description: "Fresh mango juice",
        price: "GHC 20.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 13,
        name: "Pineapple juice",
        description: "Tropical pineapple juice",
        price: "GHC 20.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 14,
        name: "Millet juice",
        description: "Traditional millet drink",
        price: "GHC 20.00",
        image: "/placeholder.svg?height=100&width=150",
      },
    ],
    "Hot Drinks": [
      {
        id: 15,
        name: "Single",
        description: "Milo, Nescafé, strawberry, Mocha, Cowbell, This Way, etc",
        price: "GHC 10.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 16,
        name: "Single with milk",
        description: "Milo, Nescafé, strawberry, Mocha, Cowbell, This Way, etc",
        price: "GHC 13.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 17,
        name: "Double",
        description: "Milo, Nescafé, strawberry, Mocha, Cowbell, This Way, etc",
        price: "GHC 15.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 18,
        name: "Double with milk",
        description: "Milo, Nescafé, strawberry, Mocha, Cowbell, This Way, etc",
        price: "GHC 19.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 19,
        name: "Lipton",
        description: "Tea options",
        price: "GHC 10.00 - 12.00",
        image: "/placeholder.svg?height=100&width=150",
      },
    ]
  }

  const menuTabs = ["Paninis", "Hotdogs", "Beverages", "Hot Drinks"]

  // Search functionality
  const filteredItems: MenuItem[] = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuItems[activeTab] || []
    }

    // Search across all categories
    const allItems = Object.entries(menuItems).flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category })),
    )

    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery, activeTab])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="w-full bg-white">
      {/* Search Bar */}
      <div className="px-4 py-3 bg-orange-500">
        <div className="mb-3">
          <h1 className="text-xl font-bold text-white">Hi There!</h1>
          <p className="text-sm text-white/90">What would you like to order today?</p>
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
          <h2 className="text-xl font-bold mb-4 text-gray-800">Today&apos;s Special Offers</h2>
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
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{offer.title}</h3>
                      <p className="text-gray-600 mb-4">{offer.description}</p>
                      <Button className="bg-orange-500 hover:bg-orange-600">Order Now</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => setCurrentSlide(prev => prev === 0 ? specialOffers.length - 1 : prev - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-orange-500" />
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => (prev + 1) % specialOffers.length)}
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
                    index === currentSlide ? 'bg-orange-500 w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Tabs - Hide when searching */}
      {!searchQuery && (
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Menu</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {menuTabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                className={`rounded-full px-6 flex-shrink-0 ${
                  activeTab === tab
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold">
            Search Results for &quot;{searchQuery}&quot; ({filteredItems.length} items)
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
                  {item.image ? (
                    <Image
                      src={item.image}
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
                    <span className="text-xs text-orange-500 font-medium mb-1 block">{item.category}</span>
                  )}
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{item.price}</span>
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 h-7 text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Extract numeric price from the price string (e.g., "GHC 12.00" -> 12.00)
                        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                        
                        // Add to cart with default quantity of 1 and no add-ons
                        addToCart({
                          id: String(item.id),
                          name: item.name,
                          price: price,
                          image: item.image,
                          category: item.category || 'Other',
                          quantity: 1,
                          addOns: {
                            friedEgg: false,
                            cheese: false,
                            vegetable: false
                          },
                          note: "",
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
            <p className="text-gray-500">No items found for &quot;{searchQuery}&quot;</p>
            <Button variant="outline" onClick={clearSearch} className="mt-2 bg-transparent">
              Clear Search
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      <FoodOrderingApp />
    </main>
  )
}

export default Home
