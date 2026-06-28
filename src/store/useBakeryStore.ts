import { create } from "zustand";
import type { CartItem, PickupTimeSlot } from "@/types";
import { BREADS } from "@/data/breads";

interface BakeryState {
  cart: CartItem[];
  pickupTime: PickupTimeSlot | null;
  phone: string;
  remark: string;
  orderSubmitted: boolean;

  addToCart: (breadId: string) => void;
  updateQuantity: (breadId: string, quantity: number) => void;
  removeFromCart: (breadId: string) => void;
  setPickupTime: (time: PickupTimeSlot) => void;
  setPhone: (phone: string) => void;
  setRemark: (remark: string) => void;
  submitOrder: () => boolean;
  resetOrder: () => void;

  getCartTotal: () => number;
  getCartCount: () => number;
  getRemainingStock: (breadId: string) => number;
}

export const useBakeryStore = create<BakeryState>((set, get) => ({
  cart: [],
  pickupTime: null,
  phone: "",
  remark: "",
  orderSubmitted: false,

  addToCart: (breadId) => {
    const { cart } = get();
    const remaining = get().getRemainingStock(breadId);
    if (remaining <= 0) return;

    const existing = cart.find((item) => item.breadId === breadId);
    if (existing) {
      set({
        cart: cart.map((item) =>
          item.breadId === breadId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { breadId, quantity: 1 }] });
    }
  },

  updateQuantity: (breadId, quantity) => {
    const { cart } = get();
    const remaining = get().getRemainingStock(breadId);
    const clampedQty = Math.max(0, Math.min(quantity, remaining));

    if (clampedQty === 0) {
      set({
        cart: cart.filter((item) => item.breadId !== breadId),
      });
    } else {
      set({
        cart: cart.map((item) =>
          item.breadId === breadId
            ? { ...item, quantity: clampedQty }
            : item
        ),
      });
    }
  },

  removeFromCart: (breadId) => {
    set({ cart: get().cart.filter((item) => item.breadId !== breadId) });
  },

  setPickupTime: (time) => set({ pickupTime: time }),
  setPhone: (phone) => set({ phone }),
  setRemark: (remark) => set({ remark }),

  submitOrder: () => {
    const { cart, pickupTime, phone } = get();
    if (cart.length === 0 || !pickupTime || !phone.trim()) {
      return false;
    }
    set({ orderSubmitted: true });
    return true;
  },

  resetOrder: () => {
    set({
      cart: [],
      pickupTime: null,
      phone: "",
      remark: "",
      orderSubmitted: false,
    });
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      const bread = BREADS.find((b) => b.id === item.breadId);
      return total + (bread ? bread.price * item.quantity : 0);
    }, 0);
  },

  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },

  getRemainingStock: (breadId) => {
    const bread = BREADS.find((b) => b.id === breadId);
    if (!bread) return 0;
    const inCart =
      get().cart.find((item) => item.breadId === breadId)?.quantity ?? 0;
    return Math.max(0, bread.stock - inCart);
  },
}));
