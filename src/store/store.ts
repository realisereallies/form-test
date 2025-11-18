import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Client {
  id: number;
  name: string;
  phone?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface Store {
  token: string | null;
  isAuthenticated: boolean;
  client: Client | null;
  selectedAccount: { id: number; name: string } | null;
  selectedOrganization: { id: number; name: string } | null;
  selectedWarehouse: { id: number; name: string } | null;
  selectedPriceType: { id: number; name: string } | null;
  cart: Product[];
  setToken: (token: string) => void;
  setAuthenticated: (value: boolean) => void;
  setClient: (client: Client | null) => void;
  setSelectedAccount: (account: { id: number; name: string } | null) => void;
  setSelectedOrganization: (org: { id: number; name: string } | null) => void;
  setSelectedWarehouse: (warehouse: { id: number; name: string } | null) => void;
  setSelectedPriceType: (priceType: { id: number; name: string } | null) => void;
  addToCart: (product: Product) => void;
  updateCartItem: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  logout: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      client: null,
      selectedAccount: null,
      selectedOrganization: null,
      selectedWarehouse: null,
      selectedPriceType: null,
      cart: [],

      setToken: (token) => set({ token }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setClient: (client) => set({ client }),
      setSelectedAccount: (account) => set({ selectedAccount: account }),
      setSelectedOrganization: (org) => set({ selectedOrganization: org }),
      setSelectedWarehouse: (warehouse) => set({ selectedWarehouse: warehouse }),
      setSelectedPriceType: (priceType) => set({ selectedPriceType: priceType }),

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((p) => p.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((p) =>
                p.id === product.id ? { ...p, qty: p.qty + product.qty } : p
              ),
            };
          }
          return { cart: [...state.cart, product] };
        }),

      updateCartItem: (id, qty) =>
        set((state) => ({
          cart: state.cart.map((p) => (p.id === id ? { ...p, qty } : p)),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== id),
        })),

      clearCart: () => set({ cart: [] }),

      logout: () =>
        set({
          token: null,
          isAuthenticated: false,
          client: null,
          selectedAccount: null,
          selectedOrganization: null,
          selectedWarehouse: null,
          selectedPriceType: null,
          cart: [],
        }),
    }),
    {
      name: 'tablecrm-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

