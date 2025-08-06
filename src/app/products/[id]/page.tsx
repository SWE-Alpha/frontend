"use client"

import { useState } from "react"
import { ArrowLeft, Menu, Star, Clock, Flame, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/cart-context"

// If the UI components are not available, we'll create simple versions
const SimpleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
  </label>
);

const SimpleTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    {...props}
    className={`min-h-[80px] w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${props.className || ''}`}
  />
);

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [addOns, setAddOns] = useState({
    friedEgg: false,
    cheese: false,
    vegetable: false,
  })
  const [note, setNote] = useState("")

  const basePrice = 90.0
  const addOnPrices = {
    friedEgg: 5.0,
    cheese: 5.0,
    vegetable: 7.0,
  }

  const totalAddOns = Object.entries(addOns).reduce((total, [key, enabled]) => {
    if (enabled) {
      return total + addOnPrices[key as keyof typeof addOnPrices]
    }
    return total
  }, 0)

  const totalPrice = (basePrice + totalAddOns) * quantity

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const toggleAddOn = (addOn: keyof typeof addOns) => {
    setAddOns((prev) => ({ ...prev, [addOn]: !prev[addOn] }))
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-white/80 backdrop-blur-sm rounded-full p-2 h-10 w-10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur-sm rounded-full p-2 h-10 w-10">
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>
        </div>

        {/* Hero Image */}
        <div className="w-full h-64 overflow-hidden">
          <img
            src="/placeholder.svg?height=256&width=400&text=Grilled+Panini+Sandwich"
            alt="Panini Sandwich"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Title and Quantity */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Panini Sandwich</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 p-0 border-gray-300 bg-transparent"
              onClick={decrementQuantity}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[20px] text-center">{quantity}</span>
            <Button
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
              onClick={incrementQuantity}
            >
              <Plus className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <div>
              <div className="text-xs text-gray-500">Rating</div>
              <div className="text-sm font-semibold">4.9</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-xs text-gray-500">Time</div>
              <div className="text-sm font-semibold">10 mins</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-xs text-gray-500">Calories</div>
              <div className="text-sm font-semibold">140-250</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Made with freshly scrambled eggs, melted cheese, and served on warm, crusty panini bread. Choose from
          delicious add-ons like tomatoes, onions, spinach, or crispy bacon for the extra kick.
        </p>

        {/* Price */}
        <div className="mb-6">
          <span className="text-3xl font-bold text-gray-900">GHC {totalPrice.toFixed(2)}</span>
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 mb-6"
          onClick={() => {
            // Calculate add-ons total
            const addOnsTotal = 
              (addOns.friedEgg ? 5 : 0) + 
              (addOns.cheese ? 5 : 0) + 
              (addOns.vegetable ? 7 : 0);
            
            // Create cart item with all required properties
            const cartItem = {
              id: params.id,
              name: "Panini Sandwich",
              price: basePrice,
              image: "/placeholder.svg?height=256&width=400&text=Grilled+Panini+Sandwich",
              category: "Panini",
              addOns: {
                friedEgg: addOns.friedEgg,
                cheese: addOns.cheese,
                vegetable: addOns.vegetable,
              },
              note: note || '',
              quantity: quantity,
              itemTotal: (basePrice + addOnsTotal) * quantity
            };
            
            addToCart(cartItem);
            router.push("/cart");
          }}
        >
          Add to Cart - GHC {totalPrice.toFixed(2)}
        </Button>

        {/* Extra Additions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Extra Additions</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Fried Egg</span>
                <span className="text-sm text-gray-500">GHC 5.00</span>
              </div>
              <div className="flex items-center gap-2">
                <SimpleSwitch
                  checked={addOns.friedEgg}
                  onChange={() => toggleAddOn("friedEgg")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Cheese</span>
                <span className="text-sm text-gray-500">GHC 5.00</span>
              </div>
              <div className="flex items-center gap-2">
                <SimpleSwitch
                  checked={addOns.cheese}
                  onChange={() => toggleAddOn("cheese")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Vegetable</span>
                <span className="text-sm text-gray-500">GHC 7.00</span>
              </div>
              <div className="flex items-center gap-2">
                <SimpleSwitch
                  checked={addOns.vegetable}
                  onChange={() => toggleAddOn("vegetable")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Note */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Add Note</h3>
          <SimpleTextarea
            placeholder="Add any special instructions..."
            value={note}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-6">
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg">
            Place Order
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 rounded-lg bg-transparent"
          >
            Cancel Order
          </Button>
        </div>
      </div>
    </div>
  )
}
