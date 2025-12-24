import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

describe('useOnClickOutside', () => {
  it('deve chamar handler quando clicar fora do elemento', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
    
    document.body.removeChild(ref.current);
    document.body.removeChild(outsideElement);
  });

  it('não deve chamar handler quando clicar dentro do elemento', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', { bubbles: true });
    ref.current.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
    
    document.body.removeChild(ref.current);
  });

  it('deve fazer cleanup dos event listeners', () => {
    const handler = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const ref = { current: document.createElement('div') };

    const { unmount } = renderHook(() => useOnClickOutside(ref, handler));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
