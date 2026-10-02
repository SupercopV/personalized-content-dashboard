import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ContentCard from "@/components/cards/ContentCard";
import favoritesReducer from "@/store/slices/favoritesSlice";
import preferencesReducer from "@/store/slices/preferencesSlice";
import feedOrderReducer from "@/store/slices/feedOrderSlice";
import { ContentItem, FavoriteItem } from "@/types/content";

function renderWithStore(
  ui: React.ReactElement,
  initialFavorites: FavoriteItem[] = []
) {
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

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}

describe("ContentCard Integration", () => {
  const mockNewsItem: ContentItem = {
    id: "card-news-1",
    type: "news",
    title: "Quantum Processor Unleashed",
    description: "Researchers showcase room-temperature quantum computing.",
    category: "technology",
    categoryLabel: "Technology",
    publishedAt: "2026-10-02T12:00:00Z",
    meta: [
      { label: "Source", value: "TechWire" },
      { label: "Author", value: "Elena" },
      { label: "Time", value: "2h ago" },
    ],
    ctaText: "Read More",
    ctaLink: "https://example.com/quantum",
    rawItem: {
      id: "card-news-1",
      title: "Quantum Processor Unleashed",
      description: "Researchers showcase room-temperature quantum computing.",
      url: "https://example.com/quantum",
      publishedAt: "2026-10-02T12:00:00Z",
      source: { id: "tech", name: "TechWire" },
      category: "technology",
    },
  };

  const mockMovieItem: ContentItem = {
    id: "card-movie-1",
    type: "movie",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen.",
    category: "entertainment",
    categoryLabel: "Movies & Cinema",
    publishedAt: "2024-03-01",
    meta: [
      { label: "Rating", value: "★ 8.8/10" },
      { label: "Votes", value: "14,200" },
      { label: "Release", value: "2024" },
    ],
    ctaText: "View Details",
    rawItem: {
      id: "card-movie-1",
      title: "Dune: Part Two",
      overview: "Paul Atreides unites with Chani and the Fremen.",
      rating: 8.8,
      voteCount: 14200,
      releaseDate: "2024-03-01",
      genres: ["Sci-Fi", "Adventure"],
      category: "entertainment",
    },
  };

  it("renders news card with title, source, and quick preview button", () => {
    renderWithStore(<ContentCard item={mockNewsItem} />);

    expect(screen.getByText("Quantum Processor Unleashed")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Researchers showcase room-temperature quantum computing."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("TechWire")).toBeInTheDocument();
    expect(screen.getByText("Quick Preview")).toBeInTheDocument();
  });

  it("renders movie card with rating and genres", () => {
    renderWithStore(<ContentCard item={mockMovieItem} />);

    expect(screen.getByText("Dune: Part Two")).toBeInTheDocument();
    expect(screen.getByText("8.8")).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi")).toBeInTheDocument();
    expect(screen.getByText("View Details")).toBeInTheDocument();
  });

  it("toggles favorite when heart button is clicked", () => {
    const { store } = renderWithStore(<ContentCard item={mockNewsItem} />);

    expect(store.getState().favorites.items).toHaveLength(0);

    const favButton = screen.getByLabelText("Add to favorites");
    fireEvent.click(favButton);

    expect(store.getState().favorites.items).toHaveLength(1);
    expect(store.getState().favorites.items[0].id).toBe("card-news-1");
  });
});
