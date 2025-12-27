import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalendarEvent } from '@/components/calendar/CalendarEvent';
const mockEvent = { id: '1', title: 'Reunião', date: '2025-01-15', type: 'meeting' };
describe('CalendarEvent', () => {
  it('renderiza evento', () => { render(<CalendarEvent event={mockEvent} />); expect(screen.getByText('Reunião')).toBeInTheDocument(); });
  it('aplica cor por tipo', () => { const { container } = render(<CalendarEvent event={mockEvent} />); expect(container.firstChild).toBeInTheDocument(); });
});
