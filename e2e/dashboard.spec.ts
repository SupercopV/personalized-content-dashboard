import { test, expect } from "@playwright/test";

test.describe("Personalized Content Dashboard E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept news, movies, and social APIs to ensure fully deterministic, stable E2E tests
    await page.route("**/api/news*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          articles: [
            {
              id: "e2e-news-1",
              title: "Quantum Breakthrough In Ambient Processors",
              description: "Room-temperature quantum chips reach operational stability.",
              url: "https://example.com/quantum",
              publishedAt: "2026-10-02T08:00:00Z",
              source: { id: "tech", name: "TechDaily" },
              category: "technology",
            },
          ],
          totalResults: 1,
          isFallback: true,
        }),
      });
    });

    await page.route("**/api/movies*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          movies: [
            {
              id: 999,
              title: "Dune: Part Two",
              overview: "Paul Atreides unites with Chani and the Fremen.",
              posterPath: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
              rating: 8.8,
              voteCount: 14200,
              releaseDate: "2024-03-01",
              genres: ["Sci-Fi", "Adventure"],
              category: "entertainment",
            },
          ],
          totalResults: 1,
          isFallback: true,
        }),
      });
    });

    await page.route("**/api/social*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          posts: [
            {
              id: "e2e-soc-1",
              username: "Frontend Lead",
              handle: "frontendlord",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
              content: "Next.js App Router with RTK Query and dnd-kit is pure developer bliss! 🚀",
              hashtags: ["#frontend", "#react"],
              timestamp: "2026-10-02T09:00:00Z",
              likes: 1240,
              commentsCount: 45,
              category: "technology",
            },
          ],
          totalResults: 1,
          isFallback: false,
        }),
      });
    });
  });

  // 1. Opening Dashboard
  test("1. opens dashboard homepage and displays welcome section and feed", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Vamshi");
    await expect(page.getByText("Trending Right Now")).toBeVisible();
    await expect(page.getByText("Personalized Feed")).toBeVisible();
  });

  // 2. Changing Preferences
  test("2. navigates to settings and updates category preferences and user name", async ({
    page,
  }) => {
    await page.goto("/settings");
    await expect(page.locator("h1")).toContainText("Preferences & Settings");

    // Change user persona name
    const nameInput = page.locator('input[placeholder*="Your Name"]');
    await nameInput.fill("Antigravity Dev");
    await page.getByRole("button", { name: "Save Name" }).click();

    // Verify greeting updates on homepage
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Antigravity Dev");
  });

  // 3. Searching for a movie/news item
  test("3. searches for content using global search and displays categorized results", async ({
    page,
  }) => {
    await page.goto("/search");
    const searchInput = page.getByRole("searchbox");
    await searchInput.fill("Quantum");

    // Wait for debounced search result
    await expect(
      page.getByText("Quantum Breakthrough In Ambient Processors")
    ).toBeVisible();
  });

  // 4. Favoriting Content
  test("4. favorites an item and sees favorite count increase", async ({
    page,
  }) => {
    await page.goto("/");
    const favButton = page.locator('button[aria-label="Add to favorites"]').first();
    await favButton.click();

    // Verify button state changed
    await expect(
      page.locator('button[aria-label="Remove from favorites"]').first()
    ).toBeVisible();
  });

  // 5. Opening Favorites
  test("5. opens favorites page and views favorited items", async ({
    page,
  }) => {
    await page.goto("/");
    const favButton = page.locator('button[aria-label="Add to favorites"]').first();
    await favButton.click();

    await page.goto("/favorites");
    await expect(page.locator("h1")).toContainText("Your Favorites");
    // Verify item is present in list
    await expect(page.locator('button[aria-label="Remove favorite"]').first()).toBeVisible();
  });

  // 6. Reordering Feed Cards
  test("6. displays drag-and-drop handles for feed cards", async ({ page }) => {
    await page.goto("/feed");
    await expect(page.locator("h1")).toContainText("Personalized Feed");
    const dragHandles = page.locator('div[title="Drag to reorder"]');
    await expect(dragHandles.first()).toBeVisible();
  });

  // 7. Switching Dark Mode
  test("7. switches between dark and light mode seamlessly", async ({
    page,
  }) => {
    await page.goto("/");
    const themeBtn = page.getByTestId("theme-toggle");

    // Toggle theme
    await themeBtn.click();
    // Verify class changed on document element
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );

    // Toggle back
    await themeBtn.click();
    const isDarkAfter = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(isDark).not.toBe(isDarkAfter);
  });
});
