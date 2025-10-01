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
import { Products, useProducts } from "@/contexts/productContext";
import { useCategories } from "@/contexts/categoryContext";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}



export default function ManageMenuPage() {


  const { products } = useProducts();
  const { categories } = useCategories();

  // Map Products to MenuItem properties
  const initialMenu: MenuItem[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: typeof p.category === 'string' ? p.category : p.category?.name || "Other",
    price: Number(p.price),
    image: p.images?.[0]?.url || "/placeholder.svg",
  }));


  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Products | null>(null);
  console.log(products);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryName: "",
    price: "",
    image: "",
    stock: "",
    featured: false,
    status: "ACTIVE",
  });

  const openAddDialog = () => {
    setEditItem(null);
    setForm({ name: "", description: "", categoryName: "", price: "", image: "", stock: "", featured: false, status: "ACTIVE" });
    setDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    const product = products.find((p) => p.id === item.id);
    setEditItem(product || null);
    setForm({
      name: item.name,
      description: item.description,
      categoryName: item.category,
      price: item.price.toString(),
      image: item.image,
      stock: product?.stock?.toString() || "",
      featured: product?.featured || false,
      status: product?.status || "ACTIVE",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
      const res = await fetch(`https://backend-mmow.vercel.app/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        setMenu(menu.filter((item) => item.id !== id));
      } else {
        // Optionally show error
        console.error("Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.categoryName || !form.price)
      return;
    try {
      // Find category by name
      const selectedCategory = categories.find((cat) => cat.name === form.categoryName);
      if (!selectedCategory) {
        console.error("Category not found");
        return;
      }
      const categoryId = selectedCategory.id;
      if (editItem) {
        // Edit product
        const updatePayload = {
          name: form.name,
          description: form.description,
          categoryId,
          price: Number(form.price),
          image: form.image,
          stock: Number(form.stock) || 0,
          featured: form.featured,
          status: form.status,
          publishedAt: new Date().toISOString(),
        };
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
        const res = await fetch(`https://backend-mmow.vercel.app/api/products/${editItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(updatePayload),
        });
        if (res.ok) {
          setMenu(
            menu.map((item) =>
              item.id === editItem.id
                ? {
                    ...item,
                    name: form.name,
                    description: form.description,
                    category: selectedCategory.name,
                    price: Number(form.price),
                    image: form.image,
                  }
                : item
            )
          );
        } else {
          console.error("Failed to update product");
        }
      } else {
        // Add product
        const createPayload = {
          name: form.name,
          description: form.description,
          categoryId,
          price: Number(form.price),
          image: form.image,
          stock: Number(form.stock) || 0,
          featured: form.featured,
          status: form.status,
          publishedAt: new Date().toISOString(),
        };
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
        const res = await fetch(`https://backend-mmow.vercel.app/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(createPayload),
        });
        if (res.ok) {
          const created = await res.json();
          setMenu([
            ...menu,
            {
              id: created.data.id,
              name: created.data.name,
              description: created.data.description,
              category: created.data.category?.name || selectedCategory.name || "Other",
              price: Number(created.data.price),
              image: created.data.images?.[0]?.url || form.image || "/public/crunch.jpg",
            },
          ]);
        } else {
          console.error("Failed to create product");
        }
      }
    } catch (err) {
      console.error("Error saving product", err);
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
            <select
              className="w-full border rounded px-3 py-2"
              value={form.categoryName}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Featured:</label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
            </div>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ARCHIVED">ARCHIVED</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
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
