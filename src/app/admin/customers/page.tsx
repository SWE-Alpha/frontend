"use client";
import { useState, useEffect } from "react";
import { useCustomers } from "@/contexts/customerContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ViewCustomersPage() {
  const [search, setSearch] = useState("");
  const { customers } = useCustomers();
  const filtered = customers.filter((c) => c.number.includes(search));
  
  

  useEffect(() => {
    console.log("Fetched customers from DB:", customers);
  }, [customers]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-8 pb-24">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-center text-xl font-semibold mb-6">Customers</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 w-5 h-5" />
          <Input
            className="pl-10 py-2 rounded-xl border border-orange-100 bg-orange-50 text-sm"
            placeholder="Search customers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2"> 
  {filtered.map((c) => (
    <div
      key={c.id}
      className="flex items-center bg-white rounded-xl px-4 py-3 shadow-sm"
    >
      {/* <img
        src={c.avatar}
        alt={c.number}
        className="w-12 h-12 rounded-full object-cover mr-4"
      /> */}
      <div className="flex-1">
        <div className="font-semibold text-base text-gray-900">
          {c.number}
        </div>
        <div className="text-sm text-gray-500">
          {c.userName}
        </div>
        {/* <div className="text-sm text-gray-500">
          {c.orders} order{c.orders > 1 ? "s" : ""}
        </div> */}
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
};

