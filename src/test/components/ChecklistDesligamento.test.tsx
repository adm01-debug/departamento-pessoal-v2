import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChecklistDesligamento } from '@/components/desligamentos/ChecklistDesligamento';
const mockItems = [{ id: '1', item: 'Entrega crachá', concluido: true }];
describe('ChecklistDesligamento', () => { it('renderiza checklist', () => { render(<ChecklistDesligamento items={mockItems} />); expect(screen.getByText('Entrega crachá')).toBeInTheDocument(); }); });
