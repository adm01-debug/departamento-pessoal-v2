import { describe, it, expect, vi } from "vitest";
import { useFormSteps } from "@/hooks/useFormSteps";
import { renderHook, act } from "@testing-library/react";
describe("useFormSteps", () => {
  it("inicia no primeiro passo", () => { const { result } = renderHook(() => useFormSteps(4)); expect(result.current.currentStep).toBe(0); expect(result.current.isFirstStep).toBe(true); });
  it("avança para próximo passo", () => { const { result } = renderHook(() => useFormSteps(4)); act(() => result.current.nextStep()); expect(result.current.currentStep).toBe(1); });
  it("não avança além do último", () => { const { result } = renderHook(() => useFormSteps(2)); act(() => result.current.nextStep()); act(() => result.current.nextStep()); expect(result.current.currentStep).toBe(1); });
  it("calcula progresso corretamente", () => { const { result } = renderHook(() => useFormSteps(4)); expect(result.current.progress).toBe(25); act(() => result.current.nextStep()); expect(result.current.progress).toBe(50); });
});
