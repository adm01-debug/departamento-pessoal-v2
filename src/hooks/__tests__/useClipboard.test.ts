import { renderHook, act } from '@testing-library/react';
import { useClipboard } from '../useClipboard';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue('clipboard content'),
  },
});

describe('useClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve iniciar com hasCopied false', () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.hasCopied).toBe(false);
  });

  it('deve copiar texto e definir hasCopied como true', async () => {
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      await result.current.copy('test text');
    });
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(result.current.hasCopied).toBe(true);
  });

  it('deve resetar hasCopied após timeout', async () => {
    const { result } = renderHook(() => useClipboard(1000));
    
    await act(async () => {
      await result.current.copy('test');
    });
    
    expect(result.current.hasCopied).toBe(true);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.hasCopied).toBe(false);
  });
});
