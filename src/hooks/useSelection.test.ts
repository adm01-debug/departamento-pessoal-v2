import { describe, it, expect, vi } from "vitest";
import { useSelection } from "@/hooks/useSelection";
import { renderHook, act } from "@testing-library/react";
describe("useSelection", () => {
  const items = [{ id: "1", name: "Item 1" }, { id: "2", name: "Item 2" }, { id: "3", name: "Item 3" }];
  const keyExtractor = (item: typeof items[0]) => item.id;
  it("inicia sem seleção", () => { const { result } = renderHook(() => useSelection(keyExtractor)); expect(result.current.selected.length).toBe(0); });
  it("seleciona item", () => { const { result } = renderHook(() => useSelection(keyExtractor)); act(() => result.current.toggle(items[0])); expect(result.current.selected.length).toBe(1); expect(result.current.isSelected(items[0])).toBe(true); });
  it("deseleciona item", () => { const { result } = renderHook(() => useSelection(keyExtractor)); act(() => result.current.toggle(items[0])); act(() => result.current.toggle(items[0])); expect(result.current.selected.length).toBe(0); });
  it("seleciona todos", () => { const { result } = renderHook(() => useSelection(keyExtractor)); act(() => result.current.selectAll(items)); expect(result.current.selected.length).toBe(3); });
  it("limpa seleção", () => { const { result } = renderHook(() => useSelection(keyExtractor)); act(() => result.current.selectAll(items)); act(() => result.current.clearSelection()); expect(result.current.selected.length).toBe(0); });
});
