"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Star, Clock, Flame, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/cart-context";
import { useProducts } from "@/contexts/productContext";
import Image from "next/image";

// UI Components
const SimpleSwitch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => (
  <label className="flex items-center justify-between w-full py-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
    </div>
  </label>
);

const SimpleTextarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
  <textarea
    {...props}
    className={`min-h-[80px] w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${props.className || ""}`}
  />
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const product = products.find((p) => p.id.toString() === id);

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [addOns, setAddOns] = useState({
    friedEgg: false,
    cheese: false,
    vegetable: false,
  });

  // Add-on prices
  const addOnPrices = {
    friedEgg: 5.0,
    cheese: 5.0,
    vegetable: 7.0,
  };

  // Only show add-ons for Paninis and Hotdogs
  const showAddOns =
    product?.category?.name === "Paninis" ||
    product?.category?.name === "Hotdogs";

  // Base price
  const basePrice = product ? parseFloat(`${product.price}`) : 0;

  // Add-ons total
  const totalAddOns = showAddOns
    ? Object.entries(addOns).reduce((total, [key, enabled]) => {
        return enabled ? total + (addOnPrices[key as keyof typeof addOnPrices] || 0) : total;
      }, 0)
    : 0;

  const totalPrice = (basePrice + totalAddOns) * quantity;

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id.toString(),
      name: product.name,
      price: basePrice,
      image: product.images?.[0]?.url || "/placeholder.svg",
      category: product.category?.name || "Other",
      addOns: { ...addOns },
      note: note,
      quantity: quantity,
      itemTotal: totalPrice,
    };

    addToCart(cartItem);
    router.push("/cart");
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find the product you&apos;re looking for.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Go Back to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
      {/* Header with back button */}
      <div className="relative flex-shrink-0">
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

        {/* Product Image */}
        <div className="relative w-full h-64 overflow-hidden">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 flex-1 flex flex-col">
        {/* Title and Quantity */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-orange-500 font-semibold text-lg">
              GHC {basePrice.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 p-0 border-gray-300 bg-transparent"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[20px] text-center">
              {quantity}
            </span>
            <Button
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600"
              onClick={incrementQuantity}
            >
              <Plus className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-600">{product.description}</p>
        </div>

        {/* Add-ons */}
        {showAddOns && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Add-ons</h2>
            <div className="space-y-2">
              <SimpleSwitch
                checked={addOns.cheese}
                onChange={(checked: boolean) =>
                  setAddOns((prev) => ({ ...prev, cheese: checked }))
                }
                label={`Extra Cheese (GHC ${addOnPrices.cheese.toFixed(2)})`}
              />
              <SimpleSwitch
                checked={addOns.friedEgg}
                onChange={(checked: boolean) =>
                  setAddOns((prev) => ({ ...prev, friedEgg: checked }))
                }
                label={`Fried Egg (GHC ${addOnPrices.friedEgg.toFixed(2)})`}
              />
              <SimpleSwitch
                checked={addOns.vegetable}
                onChange={(checked: boolean) =>
                  setAddOns((prev) => ({ ...prev, vegetable: checked }))
                }
                label={`Vegetable Mix (GHC ${addOnPrices.vegetable.toFixed(2)})`}
              />
            </div>
          </div>
        )}

        {/* Special Instructions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Special Instructions
          </h2>
          <SimpleTextarea
            placeholder="Any special requests or dietary restrictions?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
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
              <div className="text-sm font-semibold">10-15 mins</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-xs text-gray-500">Calories</div>
              <div className="text-sm font-semibold">300-500</div>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                GHC {totalPrice.toFixed(2)}
              </p>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
