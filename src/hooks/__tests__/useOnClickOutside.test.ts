import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useOnClickOutside } from '../useOnClickOutside';

describe('useOnClickOutside', () => {
  it('deve chamar handler quando clicar fora', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();

    document.body.removeChild(ref.current);
  });

  it('não deve chamar handler quando clicar dentro', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', { bubbles: true });
    ref.current.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(ref.current);
  });

  it('não deve chamar handler quando ref é null', () => {
    const handler = vi.fn();
    const ref = { current: null };

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });
});
