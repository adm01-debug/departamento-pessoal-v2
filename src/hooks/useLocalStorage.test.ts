import { describe, it, expect, vi } from "vitest";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { renderHook, act } from "@testing-library/react";
describe("useLocalStorage", () => {
  beforeEach(() => { localStorage.clear(); });
  it("retorna valor inicial", () => { const { result } = renderHook(() => useLocalStorage("test", "default")); expect(result.current.value).toBe("default"); });
  it("salva valor no localStorage", () => { const { result } = renderHook(() => useLocalStorage("test", "default")); act(() => result.current.setValue("new value")); expect(localStorage.getItem("test")).toBe('"new value"'); });
  it("carrega valor existente", () => { localStorage.setItem("existing", '"saved"'); const { result } = renderHook(() => useLocalStorage("existing", "default")); expect(result.current.value).toBe("saved"); });
  it("remove valor", () => { const { result } = renderHook(() => useLocalStorage("test", "default")); act(() => result.current.setValue("value")); act(() => result.current.removeValue()); expect(result.current.value).toBe("default"); });
});
