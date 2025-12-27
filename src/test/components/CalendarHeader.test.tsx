import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
describe('CalendarHeader', () => {
  it('renderiza mês e ano', () => { render(<CalendarHeader month={0} year={2025} onPrev={vi.fn()} onNext={vi.fn()} />); expect(screen.getByText(/janeiro/i)).toBeInTheDocument(); });
  it('navega para anterior', () => { const onPrev = vi.fn(); render(<CalendarHeader month={0} year={2025} onPrev={onPrev} onNext={vi.fn()} />); fireEvent.click(screen.getByLabelText(/anterior/i)); expect(onPrev).toHaveBeenCalled(); });
});
