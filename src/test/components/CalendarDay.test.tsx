import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalendarDay } from '@/components/calendar/CalendarDay';
describe('CalendarDay', () => {
  it('renderiza dia', () => { render(<CalendarDay day={15} />); expect(screen.getByText('15')).toBeInTheDocument(); });
  it('aplica selected', () => { const { container } = render(<CalendarDay day={1} selected />); expect(container.firstChild).toBeInTheDocument(); });
  it('aplica disabled', () => { const { container } = render(<CalendarDay day={1} disabled />); expect(container.firstChild).toBeInTheDocument(); });
});
