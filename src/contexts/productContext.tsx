"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';

// Products interface (adjust to match your actual Products structure)
interface Products {
    id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  featured: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  images: Array<{
    id: string;
    url: string;
    altText?: string;
    sortOrder: number;
  }>;
  variants: Array<{
    id: string;
    name: string;
    value: string;
    price?: number;
    stock?: number;
    sku?: string;
  }>;
  category: {
    id: string;
    name: string;
    description?: string;
  };

}

interface ProductsContextType {
  products: Products[];
  loading: boolean;
  refreshProducts: (customerId: string) => void;
  setProducts: React.Dispatch<React.SetStateAction<Products[]>>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('Fetching Products');
      const res = await fetch(`http://localhost:3001/api/products`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch Products:', errorText);
        return;
      }
      const data = await res.json();
      console.log('Fetched Products:', data);
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching Products:', error);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, refreshProducts: fetchProducts, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};