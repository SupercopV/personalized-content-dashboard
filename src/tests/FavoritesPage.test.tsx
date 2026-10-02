import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import FavoritesPage from "@/app/favorites/page";
import favoritesReducer from "@/store/slices/favoritesSlice";
import preferencesReducer from "@/store/slices/preferencesSlice";
import feedOrderReducer from "@/store/slices/feedOrderSlice";
import { FavoriteItem } from "@/types/content";

function renderWithStore(ui: React.ReactElement, initialFavorites: FavoriteItem[] = []) {
  const store = configureStore({
    reducer: {
      favorites: favoritesReducer,
      preferences: preferencesReducer,
      feedOrder: feedOrderReducer,
    },
    preloadedState: {
      favorites: { items: initialFavorites },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

describe("FavoritesPage Integration", () => {
  it("renders empty state when there are no favorites", () => {
    renderWithStore(<FavoritesPage />, []);

    expect(screen.getByText("No favorites saved yet")).toBeInTheDocument();
    expect(screen.getByText("Explore Feed")).toBeInTheDocument();
  });

  it("renders saved favorites when present in store", () => {
    const mockFav: FavoriteItem = {
      id: "fav-1",
      type: "news",
      title: "Saved Article Breakthrough",
      description: "A very exciting story saved by user.",
      category: "technology",
      categoryLabel: "Technology",
      publishedAt: "2026-10-02T10:00:00Z",
      favoritedAt: "2026-10-02T12:00:00Z",
      ctaText: "Read More",
    };

    renderWithStore(<FavoritesPage />, [mockFav]);

    expect(screen.getByText("Saved Article Breakthrough")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });
});
