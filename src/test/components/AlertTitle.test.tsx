import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertTitle } from '@/components/feedback/AlertTitle';
describe('AlertTitle', () => {
  it('renderiza título', () => {
    render(<AlertTitle>Título do Alerta</AlertTitle>);
    expect(screen.getByText('Título do Alerta')).toBeInTheDocument();
  });
  it('aplica className', () => {
    const { container } = render(<AlertTitle className="title-class">Título</AlertTitle>);
    expect(container.firstChild).toHaveClass('title-class');
  });
  it('renderiza como heading', () => {
    render(<AlertTitle>Heading</AlertTitle>);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
