import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertIcon } from '@/components/feedback/AlertIcon';
describe('AlertIcon', () => {
  it('renderiza ícone de info', () => {
    const { container } = render(<AlertIcon type="info" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('renderiza ícone de warning', () => {
    const { container } = render(<AlertIcon type="warning" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('renderiza ícone de error', () => {
    const { container } = render(<AlertIcon type="error" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('renderiza ícone de success', () => {
    const { container } = render(<AlertIcon type="success" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
