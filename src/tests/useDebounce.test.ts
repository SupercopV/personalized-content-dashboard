import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 400));
    expect(result.current).toBe("initial");
  });

  it("should delay updating the value until delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: "first", delay: 400 } }
    );

    expect(result.current).toBe("first");

    // Update the input value
    rerender({ val: "second", delay: 400 });

    // Should still have old value before delay passes
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("first");

    // Advance remaining time
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe("second");
  });

  it("should cancel previous timer on rapid keystrokes", () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: "d", delay: 400 } }
    );

    rerender({ val: "du", delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ val: "dun", delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ val: "dune", delay: 400 });

    // Hasn't completed 400ms since last change
    expect(result.current).toBe("d");

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe("dune");
  });
});
