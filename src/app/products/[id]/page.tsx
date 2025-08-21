"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Star, Clock, Flame, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart-context";
import Image from "next/image";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
}

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
    className={`min-h-[80px] w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
      props.className || ""
    }`}
  />
);

// Function to get product by ID (matching the structure in page.tsx)
const getProductById = (id: string): Promise<MenuItem | null> => {
  // This would typically be an API call in a real app
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const allItems = [
        // Paninis
        {
          id: 1,
          name: "Layman",
          description: "Egg, sausage, corn beef & Rose bread",
          price: "GHC 18.00",
          image: "/placeholder.svg?height=300&width=400&text=Layman",
        },
        {
          id: 2,
          name: "Original",
          description: "Eggs, sausage, corn beef & Big bread",
          price: "GHC 25.00",
          image: "/placeholder.svg?height=300&width=400&text=Original",
        },
        {
          id: 3,
          name: "Puff daddy",
          description: "Eggs, sausages, corn beef, cheese & BB",
          price: "GHC 33.00",
          image: "/placeholder.svg?height=300&width=400&text=Puff+Daddy",
        },
        {
          id: 4,
          name: "Chairmoo",
          description: "Eggs, sausages, corn beef, cheese & BB",
          price: "GHC 38.00",
          image: "/placeholder.svg?height=300&width=400&text=Chairmoo",
        },
        {
          id: 5,
          name: "Legend",
          description: "Eggs, sausages, corn beef, cheese, chicken & BB",
          price: "GHC 45.00",
          image: "/placeholder.svg?height=300&width=400&text=Legend",
        },
        // Hotdogs
        {
          id: 6,
          name: "Cherry Dog",
          description: "Relish, mustard, ketchup and raw onion",
          price: "GHC 25.00",
          image: "/placeholder.svg?height=300&width=400&text=Cherry+Dog",
        },
        {
          id: 7,
          name: "Chilli Dog",
          description: "Chilli sauce, mozzarella cheese, onions",
          price: "GHC 30.00",
          image: "/placeholder.svg?height=300&width=400&text=Chilli+Dog",
        },
        {
          id: 8,
          name: "Slaw Dog",
          description: "Cole slaw, sliced minced meat",
          price: "GHC 35.00",
          image: "/placeholder.svg?height=300&width=400&text=Slaw+Dog",
        },
        {
          id: 9,
          name: "Hoagie Dog",
          description: "Chilli sauce, mixed veg mayo and chicken/ minced meat",
          price: "GHC 40.00",
          image: "/placeholder.svg?height=300&width=400&text=Hoagie+Dog",
        },
        {
          id: 10,
          name: "Buffalo Dog",
          description:
            "Chilli sauce, mixed veg, mayo and chicken and minced meat",
          price: "GHC 50.00",
          image: "/placeholder.svg?height=300&width=400&text=Buffalo+Dog",
        },
        // Beverages
        {
          id: 11,
          name: "Yogurt juice",
          description: "Refreshing yogurt drink",
          price: "GHC 20.00",
          image: "/placeholder.svg?height=300&width=400&text=Yogurt+Juice",
        },
        {
          id: 12,
          name: "Mango juice",
          description: "Fresh mango juice",
          price: "GHC 20.00",
          image: "/placeholder.svg?height=300&width=400&text=Mango+Juice",
        },
        {
          id: 13,
          name: "Pineapple juice",
          description: "Tropical pineapple juice",
          price: "GHC 20.00",
          image: "/placeholder.svg?height=300&width=400&text=Pineapple+Juice",
        },
        {
          id: 14,
          name: "Millet juice",
          description: "Traditional millet drink",
          price: "GHC 20.00",
          image: "/placeholder.svg?height=300&width=400&text=Millet+Juice",
        },
        // Hot Drinks
        {
          id: 15,
          name: "Single",
          description:
            "Milo, Nescafé, strawberry, Mocha, Cowbell, This Way, etc",
          price: "GHC 10.00",
          image: "/placeholder.svg?height=300&width=400&text=Single",
        },
        {
          id: 16,
          name: "Single with milk",
          description:
            "Milo, Nescafé, strawberry, Mocha, Cowbell, This Way, etc",
          price: "GHC 13.00",
          image: "/placeholder.svg?height=300&width=400&text=Single+with+Milk",
        },
        {
          id: 17,
          name: "Double",
          description:
            "Milo, Nescafé, strawberry, Mocha, Cowbell, This Way, etc",
          price: "GHC 15.00",
          image: "/placeholder.svg?height=300&width=400&text=Double",
        },
        {
          id: 18,
          name: "Double with milk",
          description:
            "Milo, Nescafé, strawberry, Mocha, Cowbell, This Way, etc",
          price: "GHC 19.00",
          image: "/placeholder.svg?height=300&width=400&text=Double+with+Milk",
        },
        {
          id: 19,
          name: "Lipton",
          description: "Tea options",
          price: "GHC 10.00 - 12.00",
          image: "/placeholder.svg?height=300&width=400&text=Lipton",
        },
      ];

      const item = allItems.find((item) => item.id === parseInt(id)) || null;
      resolve(item);
    }, 300); // Simulate network delay
  });
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  // Available add-ons for the product
  const [addOns, setAddOns] = useState({
    friedEgg: false,
    cheese: false,
    vegetable: false,
  });

  // Fetch product data when component mounts or when params.id changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Add-on prices
  const addOnPrices = {
    friedEgg: 5.0,
    cheese: 5.0,
    vegetable: 7.0,
  };

  // Check if the product should show add-ons (only Paninis and Hotdogs)
  const showAddOns =
    product?.category === "Paninis" || product?.category === "Hotdogs";

  // Calculate total price including add-ons (only for food items)
  const basePrice = product
    ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
    : 0;
  const totalAddOns = showAddOns
    ? Object.entries(addOns).reduce((total, [key, enabled]) => {
        return enabled
          ? total + (addOnPrices[key as keyof typeof addOnPrices] || 0)
          : total;
      }, 0)
    : 0;

  const totalPrice = (basePrice + totalAddOns) * quantity;

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const toggleAddOn = (addOn: keyof typeof addOns) => {
    setAddOns((prev) => ({ ...prev, [addOn]: !prev[addOn] }));
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Create cart item with selected options
    const cartItem = {
      id: product.id.toString(),
      name: product.name,
      price: basePrice,
      image: product.image,
      category: product.category || "Other",
      addOns: { ...addOns },
      note: note,
      quantity: quantity,
      itemTotal: totalPrice,
    };

    addToCart(cartItem);
    router.push("/cart");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          {error || "We couldn't find the product you're looking for."}
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
          {product.image ? (
            <Image
              src={product.image}
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
              {product.price}
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

        {/* Add-ons - Only show for Paninis and Hotdogs */}
        {showAddOns && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Add-ons
            </h2>
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
                label={`Vegetable Mix (GHC ${addOnPrices.vegetable.toFixed(
                  2
                )})`}
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
