"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppSelector } from "@/store";

function ThemeSynchronizer({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
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
      <ThemeSynchronizer>{children}</ThemeSynchronizer>
    </Provider>
  );
}
