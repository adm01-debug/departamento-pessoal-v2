import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ButtonLoading } from '@/components/buttons/ButtonLoading';
describe('ButtonLoading', () => {
  it('renderiza botão', () => { render(<ButtonLoading>Salvar</ButtonLoading>); expect(screen.getByText('Salvar')).toBeInTheDocument(); });
  it('exibe loading', () => { render(<ButtonLoading loading>Salvando</ButtonLoading>); expect(screen.getByText(/salvando/i)).toBeInTheDocument(); });
  it('desabilita durante loading', () => { render(<ButtonLoading loading>Load</ButtonLoading>); expect(screen.getByRole('button')).toBeDisabled(); });
});
