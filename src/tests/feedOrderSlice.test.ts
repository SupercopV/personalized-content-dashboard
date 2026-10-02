import { describe, it, expect, beforeEach } from "vitest";
import feedOrderReducer, {
  setFeedOrder,
  moveFeedItem,
  resetFeedOrder,
} from "@/store/slices/feedOrderSlice";

describe("feedOrderSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty custom order", () => {
    const state = feedOrderReducer(undefined, { type: "UNKNOWN" });
    expect(state.customOrder).toEqual([]);
  });

  it("should set custom feed order", () => {
    const newOrder = ["card-3", "card-1", "card-2"];
    const state = feedOrderReducer({ customOrder: [] }, setFeedOrder(newOrder));
    expect(state.customOrder).toEqual(newOrder);
  });

  it("should reorder items on moveFeedItem", () => {
    const initial = { customOrder: ["a", "b", "c", "d"] };
    const nextState = feedOrderReducer(
      initial,
      moveFeedItem({ activeId: "a", overId: "c" })
    );
    expect(nextState.customOrder).toEqual(["b", "c", "a", "d"]);
  });

  it("should reset custom feed order", () => {
    const initial = { customOrder: ["card-1", "card-2"] };
    const nextState = feedOrderReducer(initial, resetFeedOrder());
    expect(nextState.customOrder).toEqual([]);
  });
});
