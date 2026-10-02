import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const FEED_ORDER_STORAGE_KEY = "dashboard_feed_order_v1";

interface FeedOrderState {
  customOrder: string[]; // List of card IDs in user's preferred order
}

const initialState: FeedOrderState = {
  customOrder: [],
};

const feedOrderSlice = createSlice({
  name: "feedOrder",
  initialState,
  reducers: {
    hydrateFeedOrder: (state, action: PayloadAction<string[]>) => {
      if (Array.isArray(action.payload)) {
        state.customOrder = action.payload;
      }
    },
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

export const { hydrateFeedOrder, setFeedOrder, moveFeedItem, resetFeedOrder } =
  feedOrderSlice.actions;

export default feedOrderSlice.reducer;
