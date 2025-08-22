"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface CartItemAddOns {
  friedEgg: boolean;
  cheese: boolean;
  vegetable: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  addOns: CartItemAddOns;
  note: string;
  itemTotal: number;
}

export type CartItemInput = Omit<CartItem, 'id'> & {
  id: string | number;
  itemTotal?: number; // Make it optional since it can be calculated
};

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (item: CartItemInput) => void;
  updateCartItem: (id: string, updates: Partial<Omit<CartItem, 'id'>>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (err) {
      setError('Failed to load cart. Please refresh the page.');
      console.error('Error loading cart from localStorage:', err);
    } finally {
      setIsMounted(true);
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err) {
      setError('Failed to save cart. Your changes may not be saved.');
      console.error('Error saving cart to localStorage:', err);
    }
  }, [cartItems, isMounted]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.itemTotal, 0);

  const addToCart = (itemInput: CartItemInput) => {
    setCartItems((prevItems) => {
      try {
        // Create a unique ID that includes the add-ons state
        const addOnsKey = [
          itemInput.addOns?.friedEgg ? 'egg' : '',
          itemInput.addOns?.cheese ? 'cheese' : '',
          itemInput.addOns?.vegetable ? 'veg' : ''
        ].filter(Boolean).join('-');
        
        const itemId = `${itemInput.id}-${addOnsKey}`;
        const existingItemIndex = prevItems.findIndex((i) => i.id === itemId);
        
        // Process add-ons with defaults
        const addOns = {
          friedEgg: itemInput.addOns?.friedEgg || false,
          cheese: itemInput.addOns?.cheese || false,
          vegetable: itemInput.addOns?.vegetable || false,
        };
        
        // Calculate add-ons total
        const addOnsTotal = 
          (addOns.friedEgg ? 5 : 0) + 
          (addOns.cheese ? 5 : 0) + 
          (addOns.vegetable ? 7 : 0);
        
        // Process the item
        const quantity = itemInput.quantity || 1;
        const itemTotal = (itemInput.price + addOnsTotal) * quantity;
        
        if (existingItemIndex >= 0) {
          // Item with same ID and add-ons exists, update quantity
          const existingItem = prevItems[existingItemIndex];
          const newQuantity = quantity + existingItem.quantity;
          
          const updatedItem: CartItem = {
            ...existingItem,
            quantity: newQuantity,
            note: itemInput.note !== undefined ? itemInput.note : existingItem.note,
            itemTotal: (existingItem.price + addOnsTotal) * newQuantity
          };
          
          const newItems = [...prevItems];
          newItems[existingItemIndex] = updatedItem;
          return newItems;
        }

        // Item doesn't exist, add new item
        const newItem: CartItem = {
          ...itemInput,
          id: itemId,
          quantity,
          addOns,
          note: itemInput.note || '',
          itemTotal,
        };
        
        return [...prevItems, newItem];
      } catch (err) {
        setError('Failed to add item to cart. Please try again.');
        console.error('Error adding item to cart:', err);
        return prevItems;
      }
    });
  };

  const updateCartItem = (id: string, updates: Partial<Omit<CartItem, 'id'>>) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, ...updates };
        
        // Recalculate item total if price, add-ons, or quantity changed
        if (updates.addOns || updates.price !== undefined || updates.quantity !== undefined) {
          const addOns = updates.addOns || item.addOns;
          const basePrice = updates.price !== undefined ? updates.price : item.price;
          const quantity = updates.quantity !== undefined ? updates.quantity : item.quantity;
          
          const addOnsTotal = 
            (addOns.friedEgg ? 5 : 0) + 
            (addOns.cheese ? 5 : 0) + 
            (addOns.vegetable ? 7 : 0);
          
          updatedItem.itemTotal = (basePrice + addOnsTotal) * quantity;
        }

        return updatedItem;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
