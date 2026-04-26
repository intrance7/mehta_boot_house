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
export type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type WishlistState = {
  items: WishlistItem[];
};

type WishlistAction =
  | { type: "ADD"; item: WishlistItem }
  | { type: "REMOVE"; id: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: WishlistItem[] };

type WishlistContextType = {
  items: WishlistItem[];
  totalItems: number;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  clearWishlist: () => void;
  isWishlisted: (id: number) => boolean;
  toggle: (item: WishlistItem) => void;
};

// ─── Context ─────────────────────────────────────────────────────────────────
const WishlistContext = createContext<WishlistContextType | null>(null);

// ─── Reducer ─────────────────────────────────────────────────────────────────
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };

    case "ADD": {
      const exists = state.items.find((i) => i.id === action.item.id);
      if (exists) return state; // Don't add duplicates
      return { items: [...state.items, action.item] };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });
  const { addToast } = useToast();

  // Hydrate from localStorage
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

  const totalItems = state.items.length;

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        totalItems,
        addItem: (item) => dispatch({ type: "ADD", item }),
        removeItem: (id) => dispatch({ type: "REMOVE", id }),
        clearWishlist: () => dispatch({ type: "CLEAR" }),
        isWishlisted: (id) => state.items.some((i) => i.id === id),
        toggle: (item) => {
          const exists = state.items.find((i) => i.id === item.id);
          if (exists) {
            dispatch({ type: "REMOVE", id: item.id });
            addToast(`Removed ${item.name} from wishlist`, "info");
          } else {
            dispatch({ type: "ADD", item });
            addToast(`Added ${item.name} to wishlist`, "success");
          }
        },
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}
