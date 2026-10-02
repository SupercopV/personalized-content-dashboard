import { describe, it, expect, beforeEach } from "vitest";
import preferencesReducer, {
  setCategories,
  toggleCategory,
  setTheme,
  setUserName,
  resetPreferences,
  DEFAULT_PREFERENCES,
} from "@/store/slices/preferencesSlice";
import { ContentCategory } from "@/types/content";

describe("preferencesSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the initial state", () => {
    const state = preferencesReducer(undefined, { type: "UNKNOWN" });
    expect(state.categories).toEqual(DEFAULT_PREFERENCES.categories);
    expect(state.theme).toBe("dark");
  });

  it("should set categories", () => {
    const prevState = { ...DEFAULT_PREFERENCES };
    const nextState = preferencesReducer(
      prevState,
      setCategories(["technology", "sports"])
    );
    expect(nextState.categories).toEqual(["technology", "sports"]);
  });

  it("should toggle a category off if more than 1 category exists", () => {
    const prevState = {
      ...DEFAULT_PREFERENCES,
      categories: ["technology", "business"] as ContentCategory[],
    };
    const nextState = preferencesReducer(prevState, toggleCategory("business"));
    expect(nextState.categories).toEqual(["technology"]);
  });

  it("should not remove the last remaining category", () => {
    const prevState = {
      ...DEFAULT_PREFERENCES,
      categories: ["technology"] as ContentCategory[],
    };
    const nextState = preferencesReducer(prevState, toggleCategory("technology"));
    expect(nextState.categories).toEqual(["technology"]);
  });

  it("should toggle a category on if not present", () => {
    const prevState = {
      ...DEFAULT_PREFERENCES,
      categories: ["technology"] as ContentCategory[],
    };
    const nextState = preferencesReducer(prevState, toggleCategory("sports"));
    expect(nextState.categories).toEqual(["technology", "sports"]);
  });

  it("should set theme", () => {
    const prevState = { ...DEFAULT_PREFERENCES };
    const nextState = preferencesReducer(prevState, setTheme("light"));
    expect(nextState.theme).toBe("light");
  });

  it("should set user name", () => {
    const prevState = { ...DEFAULT_PREFERENCES };
    const nextState = preferencesReducer(prevState, setUserName("Alex"));
    expect(nextState.userName).toBe("Alex");
  });

  it("should reset preferences to default", () => {
    const modifiedState = {
      categories: ["health" as ContentCategory],
      theme: "light" as const,
      sortBy: "latest" as const,
      userName: "Guest",
      isDemoMode: false,
    };
    const nextState = preferencesReducer(modifiedState, resetPreferences());
    expect(nextState.categories).toEqual(DEFAULT_PREFERENCES.categories);
    expect(nextState.theme).toBe("dark");
    expect(nextState.userName).toBe("Vamshi");
  });
});
