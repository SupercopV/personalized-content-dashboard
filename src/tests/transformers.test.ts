import { describe, it, expect } from "vitest";
import {
  newsToContentItem,
  movieToContentItem,
  socialToContentItem,
  formatCategoryLabel,
  formatRelativeTime,
} from "@/lib/transformers";
import { NewsArticle, Movie, SocialPost } from "@/types/content";

describe("transformers and formatters", () => {
  it("should map NewsArticle to unified ContentItem", () => {
    const article: NewsArticle = {
      id: "news-1",
      title: "Test News Title",
      description: "Test news description",
      url: "https://example.com/test",
      urlToImage: "https://example.com/img.jpg",
      publishedAt: "2026-10-02T10:00:00Z",
      source: { id: "test-src", name: "Test Source" },
      category: "technology",
    };

    const item = newsToContentItem(article);
    expect(item.id).toBe("news-1");
    expect(item.type).toBe("news");
    expect(item.title).toBe("Test News Title");
    expect(item.categoryLabel).toBe("Technology");
    expect(item.ctaText).toBe("Read More");
    expect(item.ctaLink).toBe("https://example.com/test");
  });

  it("should map Movie to unified ContentItem", () => {
    const movie: Movie = {
      id: 12345,
      title: "Galactic Voyage",
      overview: "An epic journey through distant stars",
      posterPath: "https://example.com/poster.jpg",
      rating: 8.5,
      voteCount: 4200,
      releaseDate: "2025-12-25",
      genres: ["Sci-Fi", "Adventure"],
      category: "entertainment",
    };

    const item = movieToContentItem(movie);
    expect(item.id).toBe("movie-12345");
    expect(item.type).toBe("movie");
    expect(item.categoryLabel).toBe("Movies & Cinema");
    expect(item.ctaText).toBe("View Details");
    expect(item.trendingScore).toBe(85);
  });

  it("should map SocialPost to unified ContentItem", () => {
    const post: SocialPost = {
      id: "soc-1",
      username: "DevTester",
      handle: "dev_test",
      avatar: "https://example.com/avatar.jpg",
      content: "Loving the new Next.js and RTK Query patterns!",
      hashtags: ["#frontend", "#react"],
      timestamp: "2026-10-02T11:00:00Z",
      likes: 540,
      commentsCount: 32,
      category: "technology",
    };

    const item = socialToContentItem(post);
    expect(item.id).toBe("soc-1");
    expect(item.type).toBe("social");
    expect(item.title).toContain("DevTester");
    expect(item.description).toBe("Loving the new Next.js and RTK Query patterns!");
    expect(item.ctaText).toBe("View Post");
  });

  it("should format category labels correctly", () => {
    expect(formatCategoryLabel("technology")).toBe("Technology");
    expect(formatCategoryLabel("business")).toBe("Business & Finance");
    expect(formatCategoryLabel("health")).toBe("Health & Wellness");
    expect(formatCategoryLabel("entertainment")).toBe("Entertainment");
  });

  it("should format relative time correctly", () => {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoMinutesAgo)).toBe("2m ago");

    const twoHoursAgo = new Date(now.getTime() - 2 * 3600 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe("2h ago");
  });
});
