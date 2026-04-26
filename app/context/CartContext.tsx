"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { useToast } from "./ToastContext";

// ─── Types ───────────────────────────────────────────────────────────────────
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD";    item: CartItem }
  | { type: "REMOVE"; id: number; size: number }
  | { type: "UPDATE"; id: number; size: number; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number, size: number) => void;
  updateQty: (id: number, size: number, qty: number) => void;
  clearCart: () => void;
  isInCart: (id: number, size: number) => boolean;
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };

    case "ADD": {
      const exists = state.items.find(
        (i) => i.id === action.item.id && i.size === action.item.size
      );
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id && i.size === action.item.size
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }

    case "REMOVE":
      return {
        items: state.items.filter(
          (i) => !(i.id === action.id && i.size === action.size)
        ),
      };

    case "UPDATE":
      return {
        items: state.items.map((i) =>
          i.id === action.id && i.size === action.size
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "mbh_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { addToast } = useToast();

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {}
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        addItem: (item) => {
          dispatch({ type: "ADD", item });
          addToast(`Added ${item.name} to bag`, "success");
        },
        removeItem: (id, size) => dispatch({ type: "REMOVE", id, size }),
        updateQty: (id, size, quantity) =>
          dispatch({ type: "UPDATE", id, size, quantity }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        isInCart: (id, size) =>
          state.items.some((i) => i.id === id && i.size === size),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}