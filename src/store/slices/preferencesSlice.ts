import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentCategory, UserPreferences } from "@/types/content";

export const PREFERENCES_STORAGE_KEY = "dashboard_preferences_v1";

const ALL_CATEGORIES: ContentCategory[] = [
  "technology",
  "business",
  "entertainment",
  "science",
  "sports",
  "health",
];

const DEFAULT_PREFERENCES: UserPreferences = {
  categories: ["technology", "business", "entertainment", "science"],
  theme: "dark",
  sortBy: "drag",
  userName: "Vamshi",
  isDemoMode: true,
};

const initialState: UserPreferences = DEFAULT_PREFERENCES;

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    hydratePreferences: (
      state,
      action: PayloadAction<Partial<UserPreferences>>
    ) => {
      if (
        action.payload.categories &&
        Array.isArray(action.payload.categories) &&
        action.payload.categories.length > 0
      ) {
        state.categories = action.payload.categories;
      }
      if (action.payload.theme) {
        state.theme = action.payload.theme;
      }
      if (action.payload.sortBy) {
        state.sortBy = action.payload.sortBy;
      }
      if (action.payload.userName) {
        state.userName = action.payload.userName;
      }
    },
    setCategories: (state, action: PayloadAction<ContentCategory[]>) => {
      state.categories = action.payload;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
        } catch {
          // ignore
        }
      }
    },
    toggleCategory: (state, action: PayloadAction<ContentCategory>) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((c) => c !== category);
        }
      } else {
        state.categories.push(category);
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
        } catch {
          // ignore
        }
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
        } catch {
          // ignore
        }
      }
    },
    setSortBy: (state, action: PayloadAction<"drag" | "latest" | "popular">) => {
      state.sortBy = action.payload;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
        } catch {
          // ignore
        }
      }
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
        } catch {
          // ignore
        }
      }
    },
    resetPreferences: (state) => {
      state.categories = DEFAULT_PREFERENCES.categories;
      state.theme = DEFAULT_PREFERENCES.theme;
      state.sortBy = DEFAULT_PREFERENCES.sortBy;
      state.userName = DEFAULT_PREFERENCES.userName;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            PREFERENCES_STORAGE_KEY,
            JSON.stringify(DEFAULT_PREFERENCES)
          );
        } catch {
          // ignore
        }
      }
    },
  },
});

export const {
  hydratePreferences,
  setCategories,
  toggleCategory,
  setTheme,
  setSortBy,
  setUserName,
  resetPreferences,
} = preferencesSlice.actions;

export { ALL_CATEGORIES, DEFAULT_PREFERENCES };
export default preferencesSlice.reducer;
