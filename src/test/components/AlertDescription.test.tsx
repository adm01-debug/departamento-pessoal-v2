import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertDescription } from '@/components/feedback/AlertDescription';
describe('AlertDescription', () => {
  it('renderiza descrição', () => {
    render(<AlertDescription>Descrição detalhada</AlertDescription>);
    expect(screen.getByText('Descrição detalhada')).toBeInTheDocument();
  });
  it('aplica className', () => {
    const { container } = render(<AlertDescription className="custom">Texto</AlertDescription>);
    expect(container.firstChild).toHaveClass('custom');
  });
});
