import { describe, it, expect, vi } from "vitest";
import { usePagination } from "@/hooks/usePagination";
import { renderHook, act } from "@testing-library/react";
describe("usePagination", () => {
  it("inicia na primeira página", () => { const { result } = renderHook(() => usePagination(100, 10)); expect(result.current.page).toBe(1); });
  it("calcula total de páginas", () => { const { result } = renderHook(() => usePagination(100, 10)); expect(result.current.totalPages).toBe(10); });
  it("avança para próxima página", () => { const { result } = renderHook(() => usePagination(100, 10)); act(() => result.current.nextPage()); expect(result.current.page).toBe(2); });
  it("não avança além do total", () => { const { result } = renderHook(() => usePagination(20, 10)); act(() => result.current.nextPage()); act(() => result.current.nextPage()); expect(result.current.page).toBe(2); });
  it("calcula índices corretamente", () => { const { result } = renderHook(() => usePagination(100, 10)); expect(result.current.startIndex).toBe(0); expect(result.current.endIndex).toBe(10); });
});
