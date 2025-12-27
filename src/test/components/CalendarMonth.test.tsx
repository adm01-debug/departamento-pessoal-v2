import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalendarMonth } from '@/components/calendar/CalendarMonth';
describe('CalendarMonth', () => {
  it('renderiza mês', () => { render(<CalendarMonth month={0} year={2025} />); expect(screen.getByText('1')).toBeInTheDocument(); });
  it('exibe dias da semana', () => { render(<CalendarMonth month={0} year={2025} />); expect(screen.getByText(/dom/i)).toBeInTheDocument(); });
});
