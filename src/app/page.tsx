"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string; // Optional since not all items have category
}

const FoodOrderingApp = () => {
  const [activeTab, setActiveTab] = useState("Hot Dog")
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
  
  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === specialOffers.length - 1 ? 0 : prev + 1))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [specialOffers.length])

  const menuItems: Record<string, MenuItem[]> = {
    Panini: [
      {
        id: 1,
        name: "Italian Panini",
        description: "Grilled panini with mozzarella and tomatoes",
        price: "GHC 18.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 2,
        name: "Chicken Panini",
        description: "Grilled chicken with pesto and cheese",
        price: "GHC 22.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 3,
        name: "Veggie Panini",
        description: "Grilled vegetables with herb spread",
        price: "GHC 16.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 4,
        name: "Turkey Panini",
        description: "Sliced turkey with avocado and cheese",
        price: "GHC 20.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 5,
        name: "Ham Panini",
        description: "Ham and swiss cheese with mustard",
        price: "GHC 19.00",
        image: "/placeholder.svg?height=100&width=150",
      },
    ],
    "Hot Dog": [
      {
        id: 1,
        name: "Cherry dog",
        description: "Beef sausage with special cherry sauce",
        price: "GHC 20.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 2,
        name: "Chilli dog",
        description: "Hot dog with spicy chilli and cheese",
        price: "GHC 25.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 3,
        name: "Slaw Dog",
        description: "Hot dog with fresh coleslaw topping",
        price: "GHC 25.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 4,
        name: "Hoagie Dog",
        description: "Long hot dog with multiple toppings",
        price: "GHC 35.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 5,
        name: "Buffalo Dog",
        description: "Hot dog with buffalo sauce and vegetables",
        price: "GHC 35.00",
        image: "/placeholder.svg?height=100&width=150",
      },
    ],
    Bread: [
      {
        id: 1,
        name: "Sourdough Loaf",
        description: "Fresh baked sourdough bread",
        price: "GHC 12.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 2,
        name: "Whole Wheat",
        description: "Healthy whole wheat bread",
        price: "GHC 10.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 3,
        name: "French Baguette",
        description: "Crispy French baguette",
        price: "GHC 8.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 4,
        name: "Rye Bread",
        description: "Traditional rye bread with seeds",
        price: "GHC 14.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 5,
        name: "Ciabatta",
        description: "Italian ciabatta bread",
        price: "GHC 15.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 6,
        name: "Focaccia",
        description: "Herb focaccia with olive oil",
        price: "GHC 18.00",
        image: "/placeholder.svg?height=100&width=150",
      },
    ],
    "Ice Cream": [
      {
        id: 1,
        name: "Vanilla Scoop",
        description: "Classic vanilla ice cream with real vanilla beans",
        price: "GHC 8.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 2,
        name: "Chocolate Fudge",
        description: "Rich chocolate ice cream with fudge swirls",
        price: "GHC 10.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 3,
        name: "Strawberry Delight",
        description: "Fresh strawberry ice cream with fruit pieces",
        price: "GHC 9.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 4,
        name: "Mint Chocolate Chip",
        description: "Cool mint ice cream with chocolate chips",
        price: "GHC 11.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 5,
        name: "Cookies & Cream",
        description: "Vanilla ice cream with crushed cookie pieces",
        price: "GHC 12.00",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        id: 6,
        name: "Caramel Swirl",
        description: "Creamy caramel ice cream with caramel ribbons",
        price: "GHC 13.00",
        image: "/placeholder.svg?height=100&width=150",
      },
    ],
  }

  const menuTabs = ["Panini", "Hot Dog", "Bread", "Ice Cream"]

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
          <h2 className="text-xl font-bold mb-4 text-gray-800">Today's Special Offers</h2>
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
            Search Results for "{searchQuery}" ({filteredItems.length} items)
          </h2>
        </div>
      )}

      {/* Products Grid */}
      <div className="px-4 pb-20">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={`${'category' in item ? (item as MenuItem).category : activeTab}-${item.id}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              >
                <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Image</span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                  {'category' in item && (
                    <span className="text-xs text-orange-500 font-medium mb-1 block">{item.category}</span>
                  )}
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{item.price}</span>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 h-7 text-xs">
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
            <p className="text-gray-500">No items found for "{searchQuery}"</p>
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
