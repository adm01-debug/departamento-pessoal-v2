import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BeneficioList } from '@/components/beneficios/BeneficioList';
const mockBeneficios = [{ id: '1', nome: 'VT', valor: 300 }, { id: '2', nome: 'VR', valor: 500 }];
describe('BeneficioList', () => {
  it('renderiza lista', () => { render(<BeneficioList beneficios={mockBeneficios} />); expect(screen.getByText('VT')).toBeInTheDocument(); expect(screen.getByText('VR')).toBeInTheDocument(); });
  it('exibe vazio', () => { render(<BeneficioList beneficios={[]} />); expect(screen.getByText(/nenhum benefício/i)).toBeInTheDocument(); });
});
