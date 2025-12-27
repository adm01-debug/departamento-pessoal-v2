import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '@/components/ui/badge';
describe('Badge', () => {
  it('renderiza badge', () => { render(<Badge>Novo</Badge>); expect(screen.getByText('Novo')).toBeInTheDocument(); });
  it('aplica variante', () => { const { container } = render(<Badge variant="destructive">Erro</Badge>); expect(container.firstChild).toBeInTheDocument(); });
});
