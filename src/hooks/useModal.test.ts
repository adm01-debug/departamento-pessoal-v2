import { describe, it, expect, vi } from "vitest";
import { useModal, useConfirmModal } from "@/hooks/useModal";
import { renderHook, act } from "@testing-library/react";
describe("useModal", () => {
  it("inicia fechado", () => { const { result } = renderHook(() => useModal()); expect(result.current.isOpen).toBe(false); });
  it("abre modal", () => { const { result } = renderHook(() => useModal()); act(() => result.current.open()); expect(result.current.isOpen).toBe(true); });
  it("fecha modal", () => { const { result } = renderHook(() => useModal(true)); act(() => result.current.close()); expect(result.current.isOpen).toBe(false); });
  it("passa dados ao abrir", () => { const { result } = renderHook(() => useModal()); act(() => result.current.open({ id: 1 })); expect(result.current.data).toEqual({ id: 1 }); });
  it("toggle funciona", () => { const { result } = renderHook(() => useModal()); act(() => result.current.toggle()); expect(result.current.isOpen).toBe(true); act(() => result.current.toggle()); expect(result.current.isOpen).toBe(false); });
});
