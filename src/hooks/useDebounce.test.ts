import { describe, it, expect, vi } from "vitest";
import { useDebounce } from "@/hooks/useDebounce";
import { renderHook, act } from "@testing-library/react";
describe("useDebounce", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  it("retorna valor inicial imediatamente", () => { const { result } = renderHook(() => useDebounce("test", 300)); expect(result.current).toBe("test"); });
  it("debounces value changes", () => { const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: "initial" } }); rerender({ value: "updated" }); expect(result.current).toBe("initial"); act(() => { vi.advanceTimersByTime(300); }); expect(result.current).toBe("updated"); });
});
