"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppDispatch, useAppSelector } from "@/store";
import {
  hydratePreferences,
  PREFERENCES_STORAGE_KEY,
} from "@/store/slices/preferencesSlice";
import {
  hydrateFavorites,
  FAVORITES_STORAGE_KEY,
} from "@/store/slices/favoritesSlice";
import {
  hydrateFeedOrder,
  FEED_ORDER_STORAGE_KEY,
} from "@/store/slices/feedOrderSlice";

function ClientHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    // 1. Rehydrate preferences from localStorage
    try {
      const savedPrefs = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        dispatch(hydratePreferences(parsed));
      }
    } catch {
      // ignore
    }

    // 2. Rehydrate favorites from localStorage
    try {
      const savedFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          dispatch(hydrateFavorites(parsed));
        }
      }
    } catch {
      // ignore
    }

    // 3. Rehydrate custom feed card sequence from localStorage
    try {
      const savedOrder = localStorage.getItem(FEED_ORDER_STORAGE_KEY);
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        if (Array.isArray(parsed)) {
          dispatch(hydrateFeedOrder(parsed));
        }
      }
    } catch {
      // ignore
    }
  }, [dispatch]);

  // Synchronize theme to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  return <>{children}</>;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ClientHydrator>{children}</ClientHydrator>
    </Provider>
  );
}
