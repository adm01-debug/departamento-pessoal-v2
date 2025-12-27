import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VacationCalendar } from '@/components/ferias/VacationCalendar';
const mockFerias = [{ id: '1', colaborador: 'João', inicio: '2025-02-01', fim: '2025-02-15' }];
describe('VacationCalendar', () => { it('renderiza calendário', () => { render(<VacationCalendar ferias={mockFerias} />); expect(screen.getByText('João')).toBeInTheDocument(); }); });
