import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClipboard } from '@/hooks/useClipboard';

describe('useClipboard', () => {
  const mockClipboard = {
    writeText: vi.fn(),
    readText: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    });
  });

  it('deve iniciar com estado vazio', () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.copiedText).toBe('');
    expect(result.current.isCopied).toBe(false);
  });

  it('deve copiar texto para clipboard', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('texto teste');
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('texto teste');
    expect(result.current.isCopied).toBe(true);
    expect(result.current.copiedText).toBe('texto teste');
  });

  it('deve lidar com erro ao copiar', async () => {
    mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      try {
        await result.current.copy('texto');
      } catch (e) {
        // Erro esperado
      }
    });

    expect(result.current.isCopied).toBe(false);
  });

  it('deve resetar isCopied após timeout', async () => {
    vi.useFakeTimers();
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useClipboard({ timeout: 1000 }));

    await act(async () => {
      await result.current.copy('texto');
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.isCopied).toBe(false);
    vi.useRealTimers();
  });
});
