import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardDescription } from '@/components/cards/CardDescription';
describe('CardDescription', () => {
  it('renderiza descrição', () => { render(<CardDescription>Descrição do card</CardDescription>); expect(screen.getByText('Descrição do card')).toBeInTheDocument(); });
});
