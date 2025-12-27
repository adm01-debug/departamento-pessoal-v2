import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalendarioAdmissoes } from '@/components/admissoes/CalendarioAdmissoes';
const mockAdmissoes = [{ id: '1', nome: 'João', dataAdmissao: '2025-01-15' }];
describe('CalendarioAdmissoes', () => {
  it('renderiza calendário', () => { render(<CalendarioAdmissoes admissoes={mockAdmissoes} />); expect(screen.getByText('João')).toBeInTheDocument(); });
});
