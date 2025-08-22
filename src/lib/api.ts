// Frontend API Integration for Buddies Inn Backend
// This file contains all API calls to the backend server

// Use environment variable in Next.js - must be prefixed with NEXT_PUBLIC_
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const API_URL = `${API_BASE_URL}/api`;

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData.error || errorData.message || `HTTP ${response.status}`
    );
  }
  return response.json();
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export interface RegisterRequest {
  email: string;
  password: string;
  userName?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      userName?: string;
      phone?: string;
      createdAt: string;
    };
    token: string;
  };
}

export interface UserProfile {
  success: boolean;
  data: {
    id: string;
    email: string;
    userName?: string;
    phone?: string;
    createdAt: string;
  };
}

// POST /api/auth/register
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await handleResponse<AuthResponse>(response);

  // Store token in localStorage
  if (result.data?.token) {
    localStorage.setItem("auth_token", result.data.token);
  }

  return result;
}

// POST /api/auth/login
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await handleResponse<AuthResponse>(response);

  // Store token in localStorage
  if (result.data?.token) {
    localStorage.setItem("auth_token", result.data.token);
  }

  return result;
}

// GET /api/auth/me
export async function getMe(): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<UserProfile>(response);
}

// Logout function (client-side)
export function logout(): void {
  localStorage.removeItem("auth_token");
  // Optionally redirect to login page
}

// ============================================================================
// PRODUCT ENDPOINTS
// ============================================================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  featured: boolean;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";
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

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";
  featured?: boolean;
  categoryId?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock?: number;
  featured?: boolean;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";
  images?: Array<{
    url: string;
    altText?: string;
    sortOrder?: number;
  }>;
  variants?: Array<{
    name: string;
    value: string;
    price?: number;
    stock?: number;
    sku?: string;
  }>;
}

// GET /api/products
export async function fetchProducts(
  query: ProductsQuery = {}
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const response = await fetch(`${API_URL}/products?${searchParams}`, {
    credentials: "include",
  });
  return handleResponse<ProductsResponse>(response);
}

// GET /api/products/:id
export async function fetchProductById(id: string): Promise<ProductResponse> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    credentials: "include",
  });
  return handleResponse<ProductResponse>(response);
}

// POST /api/products (admin only)
export async function createProduct(
  data: CreateProductRequest
): Promise<ProductResponse> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<ProductResponse>(response);
}

// PUT /api/products/:id (admin only)
export async function updateProduct(
  id: string,
  data: Partial<CreateProductRequest>
): Promise<ProductResponse> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<ProductResponse>(response);
}

// DELETE /api/products/:id (admin only)
export async function deleteProduct(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string }>(response);
}

// ============================================================================
// CART ENDPOINTS
// ============================================================================

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock?: number;
    featured: boolean;
    status: string;
    category: {
      id: string;
      name: string;
      description?: string;
    };
  };
}

export interface Cart {
  id: string;
  userId: string;
  subtotal: number;
  items: CartItem[];
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

export interface AddCartItemRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// GET /api/cart
export async function fetchCart(): Promise<CartResponse> {
  const response = await fetch(`${API_URL}/cart`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<CartResponse>(response);
}

// POST /api/cart/items
export async function addToCart(
  data: AddCartItemRequest
): Promise<CartResponse> {
  const response = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<CartResponse>(response);
}

// PUT /api/cart/items/:itemId
export async function updateCartItem(
  itemId: string,
  data: UpdateCartItemRequest
): Promise<CartResponse> {
  const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<CartResponse>(response);
}

// DELETE /api/cart/items/:itemId
export async function removeCartItem(itemId: string): Promise<CartResponse> {
  const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<CartResponse>(response);
}

// DELETE /api/cart
export async function clearCart(): Promise<CartResponse> {
  const response = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<CartResponse>(response);
}

// ============================================================================
// ORDER ENDPOINTS
// ============================================================================

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
}

// POST /api/orders
export async function createOrder(): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<OrderResponse>(response);
}

// GET /api/orders
export async function fetchOrders(): Promise<OrdersResponse> {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<OrdersResponse>(response);
}

// GET /api/orders/:id
export async function fetchOrderById(id: string): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<OrderResponse>(response);
}

// ============================================================================
// CATEGORY ENDPOINTS
// ============================================================================

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  products?: Product[];
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// GET /api/categories
export async function fetchCategories(): Promise<CategoriesResponse> {
  const response = await fetch(`${API_URL}/categories`, {
    credentials: "include",
  });
  return handleResponse<CategoriesResponse>(response);
}

// GET /api/categories/:id
export async function fetchCategoryById(id: string): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    credentials: "include",
  });
  return handleResponse<CategoryResponse>(response);
}

// POST /api/categories (auth required)
export async function createCategory(
  data: CreateCategoryRequest
): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<CategoryResponse>(response);
}

// PUT /api/categories/:id (auth required)
export async function updateCategory(
  id: string,
  data: Partial<CreateCategoryRequest>
): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<CategoryResponse>(response);
}

// DELETE /api/categories/:id (auth required)
export async function deleteCategory(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string }>(response);
}

// ============================================================================
// REVIEW ENDPOINTS
// ============================================================================

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  verified: boolean;
  status: string;
  createdAt: string;
  user: {
    id: string;
    userName?: string;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
}

export interface CreateReviewRequest {
  rating: number;
  title?: string;
  comment?: string;
}

// GET /api/products/:productId/reviews
export async function fetchProductReviews(
  productId: string
): Promise<ReviewsResponse> {
  const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
    credentials: "include",
  });
  return handleResponse<ReviewsResponse>(response);
}

// POST /api/products/:productId/reviews (auth required)
export async function addProductReview(
  productId: string,
  data: CreateReviewRequest
): Promise<ReviewResponse> {
  const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<ReviewResponse>(response);
}

// DELETE /api/reviews/:id (auth required)
export async function deleteReview(
  reviewId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string }>(response);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("auth_token");
}

// Get current auth token
export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

// Health check endpoint
export async function healthCheck(): Promise<{
  status: string;
  message: string;
  timestamp: string;
}> {
  const response = await fetch(`${API_URL}/health`);
  return handleResponse<{ status: string; message: string; timestamp: string }>(
    response
  );
}
