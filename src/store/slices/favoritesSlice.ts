import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FavoriteItem } from "@/types/content";

export const FAVORITES_STORAGE_KEY = "dashboard_favorites_v1";

interface FavoritesState {
  items: FavoriteItem[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    hydrateFavorites: (state, action: PayloadAction<FavoriteItem[]>) => {
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
      }
    },
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

export const {
  hydrateFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
