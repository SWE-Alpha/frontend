"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';

// Categories interface (adjust to match your actual Categories structure)
interface Categories {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;

}

interface CategoriesContextType {
  categories: Categories[];
  loading: boolean;
  refreshCategories: (customerId: string) => void;
  setCategories: React.Dispatch<React.SetStateAction<Categories[]>>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      console.log('Fetching Categories');
      const res = await fetch(`https://backend-mmow.vercel.app/api/categories`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch Categories:', errorText);
        return;
      }
      const data = await res.json();
      console.log('Fetched Categories:', data);
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching Categories:', error);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading, refreshCategories: fetchCategories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};