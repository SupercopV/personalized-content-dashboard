import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const FEED_ORDER_STORAGE_KEY = "dashboard_feed_order_v1";

interface FeedOrderState {
  customOrder: string[]; // List of card IDs in user's preferred order
}

const loadInitialOrder = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(FEED_ORDER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
};

const initialState: FeedOrderState = {
  customOrder: loadInitialOrder(),
};

const feedOrderSlice = createSlice({
  name: "feedOrder",
  initialState,
  reducers: {
    setFeedOrder: (state, action: PayloadAction<string[]>) => {
      state.customOrder = action.payload;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(FEED_ORDER_STORAGE_KEY, JSON.stringify(action.payload));
        } catch {
          // ignore
        }
      }
    },
    moveFeedItem: (
      state,
      action: PayloadAction<{ activeId: string; overId: string }>
    ) => {
      const { activeId, overId } = action.payload;
      const oldIndex = state.customOrder.indexOf(activeId);
      const newIndex = state.customOrder.indexOf(overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updated = [...state.customOrder];
        const [removed] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, removed);
        state.customOrder = updated;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(FEED_ORDER_STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
      }
    },
    resetFeedOrder: (state) => {
      state.customOrder = [];
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(FEED_ORDER_STORAGE_KEY);
        } catch {
          // ignore
        }
      }
    },
  },
});

export const { setFeedOrder, moveFeedItem, resetFeedOrder } =
  feedOrderSlice.actions;

export default feedOrderSlice.reducer;
