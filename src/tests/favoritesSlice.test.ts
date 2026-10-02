import { describe, it, expect, beforeEach } from "vitest";
import favoritesReducer, {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
} from "@/store/slices/favoritesSlice";
import { FavoriteItem } from "@/types/content";

describe("favoritesSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockItem: FavoriteItem = {
    id: "item-1",
    type: "news",
    title: "Quantum Breakthrough",
    description: "Quantum chips achieve stability",
    category: "technology",
    categoryLabel: "Technology",
    publishedAt: "2026-10-02T00:00:00Z",
    favoritedAt: "2026-10-02T01:00:00Z",
    ctaText: "Read More",
  };

  it("should initialize with empty array", () => {
    const state = favoritesReducer(undefined, { type: "UNKNOWN" });
    expect(state.items).toEqual([]);
  });

  it("should add a favorite item", () => {
    const state = favoritesReducer({ items: [] }, addFavorite(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe("item-1");
  });

  it("should not add duplicate favorite items", () => {
    const prevState = { items: [mockItem] };
    const nextState = favoritesReducer(prevState, addFavorite(mockItem));
    expect(nextState.items).toHaveLength(1);
  });

  it("should remove a favorite item by ID", () => {
    const prevState = { items: [mockItem] };
    const nextState = favoritesReducer(prevState, removeFavorite("item-1"));
    expect(nextState.items).toHaveLength(0);
  });

  it("should toggle favorite: add if not present, remove if present", () => {
    const state1 = favoritesReducer({ items: [] }, toggleFavorite(mockItem));
    expect(state1.items).toHaveLength(1);

    const state2 = favoritesReducer(state1, toggleFavorite(mockItem));
    expect(state2.items).toHaveLength(0);
  });

  it("should clear all favorites", () => {
    const prevState = {
      items: [
        mockItem,
        { ...mockItem, id: "item-2", title: "Second Story" },
      ],
    };
    const nextState = favoritesReducer(prevState, clearFavorites());
    expect(nextState.items).toEqual([]);
  });
});
