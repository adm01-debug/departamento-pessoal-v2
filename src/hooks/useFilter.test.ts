import { describe, it, expect, vi } from "vitest";
import { useFilter } from "@/hooks/useFilter";
import { renderHook, act } from "@testing-library/react";
describe("useFilter", () => {
  const data = [{ name: "João", dept: "TI" }, { name: "Maria", dept: "RH" }, { name: "Pedro", dept: "TI" }];
  const filterFn = (item: typeof data[0], filters: any) => !filters.dept || item.dept === filters.dept;
  it("retorna todos os dados sem filtro", () => { const { result } = renderHook(() => useFilter(data, filterFn)); expect(result.current.filteredData.length).toBe(3); });
  it("filtra por departamento", () => { const { result } = renderHook(() => useFilter(data, filterFn)); act(() => result.current.setFilter("dept", "TI")); expect(result.current.filteredData.length).toBe(2); });
  it("remove filtro", () => { const { result } = renderHook(() => useFilter(data, filterFn)); act(() => result.current.setFilter("dept", "TI")); act(() => result.current.removeFilter("dept")); expect(result.current.filteredData.length).toBe(3); });
  it("limpa todos os filtros", () => { const { result } = renderHook(() => useFilter(data, filterFn)); act(() => result.current.setFilter("dept", "TI")); act(() => result.current.clearFilters()); expect(result.current.hasActiveFilters).toBe(false); });
});
