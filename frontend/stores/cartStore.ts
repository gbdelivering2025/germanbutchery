import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, UnitPrice } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, unitPrice: UnitPrice, quantity: number) => void;
  removeItem: (productId: number, unitPriceId: number) => void;
  updateQuantity: (productId: number, unitPriceId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, unitPrice, quantity) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.unitPrice.id === unitPrice.id
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }

          return {
            items: [...state.items, { product, unitPrice, quantity }],
          };
        });
      },

      removeItem: (productId, unitPriceId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.unitPrice.id === unitPriceId)
          ),
        }));
      },

      updateQuantity: (productId, unitPriceId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, unitPriceId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.unitPrice.id === unitPriceId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.unitPrice.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
