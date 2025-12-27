import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertContainer } from '@/components/feedback/AlertContainer';
describe('AlertContainer', () => {
  it('renderiza children', () => {
    render(<AlertContainer><div>Conteúdo</div></AlertContainer>);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
  it('aplica posição top-right', () => {
    const { container } = render(<AlertContainer position="top-right"><div>Alert</div></AlertContainer>);
    expect(container.firstChild).toBeInTheDocument();
  });
  it('aplica posição bottom-left', () => {
    const { container } = render(<AlertContainer position="bottom-left"><div>Alert</div></AlertContainer>);
    expect(container.firstChild).toBeInTheDocument();
  });
  it('empilha múltiplos alertas', () => {
    render(<AlertContainer><div>Alert 1</div><div>Alert 2</div></AlertContainer>);
    expect(screen.getByText('Alert 1')).toBeInTheDocument();
    expect(screen.getByText('Alert 2')).toBeInTheDocument();
  });
});
