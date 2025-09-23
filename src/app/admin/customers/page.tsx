"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const customers = [
  {
    id: "1",
    phone: "+1 (555) 123-4567",
    orders: 5,
    avatar: "/public/avatar1.png",
  },
  {
    id: "2",
    phone: "+1 (555) 987-6543",
    orders: 2,
    avatar: "/public/avatar2.png",
  },
  {
    id: "3",
    phone: "+1 (555) 246-8013",
    orders: 10,
    avatar: "/public/avatar3.png",
  },
  {
    id: "4",
    phone: "+1 (555) 135-7924",
    orders: 3,
    avatar: "/public/avatar4.png",
  },
  {
    id: "5",
    phone: "+1 (555) 369-1212",
    orders: 7,
    avatar: "/public/avatar5.png",
  },
  {
    id: "6",
    phone: "+1 (555) 789-0123",
    orders: 1,
    avatar: "/public/avatar6.png",
  },
];

export default function ViewCustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = customers.filter((c) => c.phone.includes(search));

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
              <img
                src={c.avatar}
                alt={c.phone}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div className="flex-1">
                <div className="font-semibold text-base text-gray-900">
                  {c.phone}
                </div>
                <div className="text-sm text-gray-500">
                  {c.orders} order{c.orders > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
