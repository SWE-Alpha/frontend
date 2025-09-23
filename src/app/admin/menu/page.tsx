"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

const initialMenu: MenuItem[] = [
  {
    id: "1",
    name: "Creamy Pasta",
    description: "Delicious pasta with creamy sauce",
    category: "Pasta",
    price: 25,
    image: "/public/crunch.jpg",
  },
  {
    id: "2",
    name: "Spicy Wings",
    description: "Spicy chicken wings",
    category: "Starters",
    price: 18,
    image: "/public/menuIcon.jpg",
  },
  {
    id: "3",
    name: "Fresh Bread",
    description: "Freshly baked bread",
    category: "Bakery",
    price: 10,
    image: "/public/heroimg.png",
  },
  {
    id: "4",
    name: "Lemonade",
    description: "Refreshing lemonade",
    category: "Drinks",
    price: 8,
    image: "/public/window.svg",
  },
];

export default function ManageMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });

  const openAddDialog = () => {
    setEditItem(null);
    setForm({ name: "", description: "", category: "", price: "", image: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price.toString(),
      image: item.image,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMenu(menu.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!form.name || !form.description || !form.category || !form.price)
      return;
    if (editItem) {
      setMenu(
        menu.map((item) =>
          item.id === editItem.id
            ? { ...item, ...form, price: Number(form.price) }
            : item
        )
      );
    } else {
      setMenu([
        ...menu,
        {
          id: Date.now().toString(),
          name: form.name,
          description: form.description,
          category: form.category,
          price: Number(form.price),
          image: form.image || "/public/crunch.jpg",
        },
      ]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-8 pb-24">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-center text-xl font-semibold mb-6">Menu Items</h2>
        <div className="space-y-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white rounded-xl shadow-sm px-4 py-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover mr-4"
              />
              <div className="flex-1">
                <div className="font-semibold text-base text-gray-900">
                  {item.name}
                </div>
                <div className="text-sm text-gray-500">{item.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {item.category}
                </div>
              </div>
              <div className="font-semibold text-orange-600 mr-4">
                GHS {item.price.toFixed(2)}
              </div>
              <button
                className="ml-2 text-orange-500 hover:text-orange-600"
                onClick={() => openEditDialog(item)}
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                className="ml-2 text-red-500 hover:text-red-600"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-8 py-4 shadow-lg flex items-center gap-1"
        onClick={openAddDialog}
      >
        <Plus className="w-5 h-5" /> Add New Item
      </button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              placeholder="Image URL (optional)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <div className="flex justify-end gap-1">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSave}>
                {editItem ? "Save Changes" : "Add Item"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
