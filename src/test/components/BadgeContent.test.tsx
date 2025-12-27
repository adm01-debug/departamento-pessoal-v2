import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BadgeContent } from '@/components/badges/BadgeContent';
describe('BadgeContent', () => {
  it('renderiza conteúdo', () => { render(<BadgeContent>Texto</BadgeContent>); expect(screen.getByText('Texto')).toBeInTheDocument(); });
  it('aplica cor', () => { const { container } = render(<BadgeContent color="success">OK</BadgeContent>); expect(container.firstChild).toBeInTheDocument(); });
});
