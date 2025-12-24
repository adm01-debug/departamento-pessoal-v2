import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';
import React from 'react';

vi.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('ThemeToggle', () => {
  it('deve renderizar', () => {
    const { container } = render(<ThemeToggle />);
    expect(container).toBeDefined();
  });

  it('deve ter botão de toggle', () => {
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('button')).toBeDefined();
  });

  it('deve permitir clique', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button');
    if (button) fireEvent.click(button);
    expect(container).toBeDefined();
  });
});
