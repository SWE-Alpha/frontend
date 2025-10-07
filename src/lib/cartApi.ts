// API utility for syncing cart to backend
import { CartItem } from "../app/cart-context";

const API_URL = 'https://backend-mmow.vercel.app';

export interface SyncCartResponse {
  success: boolean;
  message?: string;
}

// Sync local cart to backend: clear backend cart, then add all items
export async function syncCartToBackend(cartItems: CartItem[], token: string): Promise<SyncCartResponse> {
  // 1. Clear backend cart
  await fetch(`${API_URL}/api/cart`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 2. Add all items
  for (const item of cartItems) {
    await fetch(`${API_URL}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: item.id.split('-')[0], // Remove add-on suffix for backend
        quantity: item.quantity,
      }),
    });
  }
  return { success: true };
}
