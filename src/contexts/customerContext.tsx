"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";

// Customer interface (matches user structure)

export interface CustomerResponse {
  success: boolean;
  data: Customer[];
}

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  refreshCustomers: (token?: string) => void;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomersContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomers = () => {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomersProvider");
  }
  return context;
};

export const CustomersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const fetchCustomers = async () => {
  setLoading(true);
  try {
    console.log("Fetching Customers");

    const res = await fetch(`https://backend-mmow.vercel.app/api/users`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZnVmNDV0cDAwMDBsNTA0ZGM5cTY3b2wiLCJpYXQiOjE3NTg1OTcxMTIsImV4cCI6MTc1OTIwMTkxMn0.5SYb57C4v2DO_5oSmZO1AUwAu9NRMMBX_ZLRyknXiEA` : "", //This token was used for testing purposes only
  },
});

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch Orders:", errorText);
      return;
    }

    const data = await res.json();
    console.log("Fetched Customers:", data);
    setCustomers(data.data);
  } catch (error) {
    console.error("Error fetching Customers:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCustomers(); // consider passing token if required
  }, []);

  return (
    <CustomersContext.Provider value={{ customers, loading, refreshCustomers: fetchCustomers, setCustomers }}>
      {children}
    </CustomersContext.Provider>
  );
};
