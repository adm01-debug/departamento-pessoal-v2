import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarNav } from '@/components/calendar/CalendarNav';
describe('CalendarNav', () => {
  it('renderiza navegação', () => { render(<CalendarNav onPrev={vi.fn()} onNext={vi.fn()} onToday={vi.fn()} />); expect(screen.getByText(/hoje/i)).toBeInTheDocument(); });
  it('vai para hoje', () => { const onToday = vi.fn(); render(<CalendarNav onPrev={vi.fn()} onNext={vi.fn()} onToday={onToday} />); fireEvent.click(screen.getByText(/hoje/i)); expect(onToday).toHaveBeenCalled(); });
});
