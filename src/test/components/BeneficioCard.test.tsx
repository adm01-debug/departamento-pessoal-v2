import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BeneficioCard } from '@/components/beneficios/BeneficioCard';
const mockBeneficio = { id: '1', nome: 'Vale Transporte', valor: 300, status: 'ativo' };
describe('BeneficioCard', () => {
  it('renderiza benefício', () => { render(<BeneficioCard beneficio={mockBeneficio} />); expect(screen.getByText('Vale Transporte')).toBeInTheDocument(); });
  it('executa onClick', () => { const onClick = vi.fn(); render(<BeneficioCard beneficio={mockBeneficio} onClick={onClick} />); fireEvent.click(screen.getByText('Vale Transporte')); expect(onClick).toHaveBeenCalled(); });
});
