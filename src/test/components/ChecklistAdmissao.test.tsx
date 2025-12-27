import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChecklistAdmissao } from '@/components/admissoes/ChecklistAdmissao';
const mockItems = [{ id: '1', item: 'RG', concluido: true }, { id: '2', item: 'CPF', concluido: false }];
describe('ChecklistAdmissao', () => { it('renderiza checklist', () => { render(<ChecklistAdmissao items={mockItems} />); expect(screen.getByText('RG')).toBeInTheDocument(); }); });
