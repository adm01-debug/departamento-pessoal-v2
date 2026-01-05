import { describe, it, expect, vi } from "vitest";
import { useSort } from "@/hooks/useSort";
import { renderHook, act } from "@testing-library/react";
describe("useSort", () => {
  const data = [{ nome: "Carlos", idade: 30 }, { nome: "Ana", idade: 25 }, { nome: "Bruno", idade: 35 }];
  it("retorna dados originais sem ordenação", () => { const { result } = renderHook(() => useSort(data)); expect(result.current.sortedData).toEqual(data); });
  it("ordena por campo ascendente", () => { const { result } = renderHook(() => useSort(data)); act(() => result.current.sort("nome")); expect(result.current.sortedData[0].nome).toBe("Ana"); });
  it("inverte ordenação ao clicar novamente", () => { const { result } = renderHook(() => useSort(data)); act(() => result.current.sort("nome")); act(() => result.current.sort("nome")); expect(result.current.sortedData[0].nome).toBe("Carlos"); });
  it("limpa ordenação", () => { const { result } = renderHook(() => useSort(data)); act(() => result.current.sort("nome")); act(() => result.current.clearSort()); expect(result.current.sortKey).toBeNull(); });
});
