import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FavoriteItem } from "@/types/content";

const FAVORITES_STORAGE_KEY = "dashboard_favorites_v1";

interface FavoritesState {
  items: FavoriteItem[];
}

const loadInitialFavorites = (): FavoriteItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore json error
  }
  return [];
};

const initialState: FavoritesState = {
  items: loadInitialFavorites(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const exists = state.items.some((i) => i.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.items));
          } catch {
            // ignore
          }
        }
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.items));
        } catch {
          // ignore
        }
      }
    },
    toggleFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(action.payload);
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.items));
        } catch {
          // ignore
        }
      }
    },
    clearFavorites: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(FAVORITES_STORAGE_KEY);
        } catch {
          // ignore
        }
      }
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
