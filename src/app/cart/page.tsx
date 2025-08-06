"use client"

import { useState } from "react"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "../cart-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const { cartItems, updateCartItem, removeFromCart, clearCart, cartTotal, cartCount } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  const addOnPrices = {
    friedEgg: 5.0,
    cheese: 5.0,
    vegetable: 7.0,
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id)
    } else {
      updateCartItem(id, { quantity: newQuantity })
    }
  }

  const toggleAddOn = (id: string, addOn: keyof typeof addOnPrices) => {
    const item = cartItems.find((item) => item.id === id)
    if (item) {
      updateCartItem(id, {
        addOns: {
          ...item.addOns,
          [addOn]: !item.addOns[addOn],
        },
      })
    }
  }

  const getAddOnsList = (addOns: any) => {
    const activeAddOns = Object.entries(addOns)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => {
        switch (key) {
          case "friedEgg":
            return "Fried Egg"
          case "cheese":
            return "Cheese"
          case "vegetable":
            return "Vegetable"
          default:
            return key
        }
      })
    return activeAddOns.length > 0 ? activeAddOns.join(", ") : "No add-ons"
  }

  const handleCheckout = () => {
    setShowCheckout(true)
    // Simulate order processing
    setTimeout(() => {
      clearCart()
      setShowCheckout(false)
      router.push("/")
      alert("Order placed successfully!")
    }, 2000)
  }

  if (showCheckout) {
    return (
      <div className="fixed inset-0 bg-white z-50 max-w-sm mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Processing Order...</h2>
          <p className="text-gray-600">Please wait while we prepare your order</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 max-w-sm mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-orange-500 px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-orange-600 p-2" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Your Cart</h1>
            <p className="text-sm text-white/90">{cartCount} items</p>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 px-4 py-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
            <Button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600">
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-600 mb-1">{item.category}</p>
                          <p className="text-xs text-orange-600">{getAddOnsList(item.addOns)}</p>
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

                      {item.note && <p className="text-xs text-gray-500 mb-2 italic">Note: {item.note}</p>}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-7 h-7 p-0 rounded-full bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-7 h-7 p-0 rounded-full bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="font-semibold text-sm">GHC {item.itemTotal.toFixed(2)}</span>
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
                Checkout - GHC {(cartTotal + 7).toFixed(2)}
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
    </div>
  )
}
