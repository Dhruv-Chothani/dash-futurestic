import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "User";
  status: "active" | "inactive";
  avatar?: string;
  joined: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  status: "active" | "draft";
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  time: string;
}

interface AppState {
  isAuthenticated: boolean;
  adminUser: { email: string; name: string } | null;
  users: User[];
  products: Product[];
  orders: Order[];
  categories: Category[];
  notifications: Notification[];
  sidebarOpen: boolean;

  login: (email: string, password: string) => boolean;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;

  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  addCategory: (cat: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const seedUsers: User[] = [
  { id: uid(), name: "Sarah Chen", email: "sarah@example.com", role: "Admin", status: "active", joined: "2024-01-15" },
  { id: uid(), name: "James Wilson", email: "james@example.com", role: "Manager", status: "active", joined: "2024-02-20" },
  { id: uid(), name: "Maya Patel", email: "maya@example.com", role: "User", status: "active", joined: "2024-03-10" },
  { id: uid(), name: "Alex Rivera", email: "alex@example.com", role: "User", status: "inactive", joined: "2024-04-05" },
  { id: uid(), name: "Liam Foster", email: "liam@example.com", role: "Manager", status: "active", joined: "2024-05-12" },
];

const seedProducts: Product[] = [
  { id: uid(), name: "Quantum Pro Headset", category: "Electronics", price: 349.99, stock: 124, status: "active" },
  { id: uid(), name: "Neural Interface Kit", category: "Electronics", price: 899.99, stock: 45, status: "active" },
  { id: uid(), name: "Holo Display Panel", category: "Displays", price: 1299.00, stock: 18, status: "active" },
  { id: uid(), name: "Flux Capacitor Module", category: "Components", price: 199.50, stock: 230, status: "draft" },
  { id: uid(), name: "Plasma Shield Case", category: "Accessories", price: 79.99, stock: 500, status: "active" },
];

const seedOrders: Order[] = [
  { id: "ORD-001", customer: "Sarah Chen", email: "sarah@example.com", total: 1249.98, status: "delivered", items: 3, date: "2024-12-01" },
  { id: "ORD-002", customer: "James Wilson", email: "james@example.com", total: 899.99, status: "shipped", items: 1, date: "2024-12-05" },
  { id: "ORD-003", customer: "Maya Patel", email: "maya@example.com", total: 429.98, status: "processing", items: 2, date: "2024-12-08" },
  { id: "ORD-004", customer: "Alex Rivera", email: "alex@example.com", total: 1299.00, status: "pending", items: 1, date: "2024-12-10" },
  { id: "ORD-005", customer: "Liam Foster", email: "liam@example.com", total: 279.49, status: "cancelled", items: 2, date: "2024-12-12" },
];

const seedCategories: Category[] = [
  { id: uid(), name: "Electronics", description: "Electronic devices and gadgets", productCount: 2 },
  { id: uid(), name: "Displays", description: "Holographic and visual displays", productCount: 1 },
  { id: uid(), name: "Components", description: "Hardware components and modules", productCount: 1 },
  { id: uid(), name: "Accessories", description: "Cases, covers, and add-ons", productCount: 1 },
];

const seedNotifications: Notification[] = [
  { id: uid(), title: "New Order", message: "Order ORD-005 has been placed", type: "info", read: false, time: "2m ago" },
  { id: uid(), title: "Low Stock Alert", message: "Holo Display Panel is running low", type: "warning", read: false, time: "15m ago" },
  { id: uid(), title: "Payment Received", message: "Payment for ORD-003 confirmed", type: "success", read: true, time: "1h ago" },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminUser: null,
      users: seedUsers,
      products: seedProducts,
      orders: seedOrders,
      categories: seedCategories,
      notifications: seedNotifications,
      sidebarOpen: true,

      login: (email, password) => {
        if (email === "admin@admin.com" && password === "admin123") {
          set({ isAuthenticated: true, adminUser: { email, name: "Admin" } });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, adminUser: null }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      addUser: (user) => set((s) => ({ users: [...s.users, user] })),
      updateUser: (id, data) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      addProduct: (product) => set((s) => ({ products: [...s.products, product] })),
      updateProduct: (id, data) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      addOrder: (order) => set((s) => ({ orders: [...s.orders, order] })),
      updateOrder: (id, data) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...data } : o)) })),
      deleteOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      addCategory: (cat) => set((s) => ({ categories: [...s.categories, cat] })),
      updateCategory: (id, data) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: "admin-dashboard-store" }
  )
);
