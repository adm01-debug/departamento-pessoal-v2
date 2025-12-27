import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DesligamentoChecklist } from '@/components/desligamentos/DesligamentoChecklist';
const mockItems = [{ id: '1', item: 'Devolução crachá', concluido: false }];
describe('DesligamentoChecklist', () => { it('renderiza checklist', () => { render(<DesligamentoChecklist items={mockItems} />); expect(screen.getByText('Devolução crachá')).toBeInTheDocument(); }); });
