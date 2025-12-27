import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MiniCalendar } from '@/components/calendar/MiniCalendar';
describe('MiniCalendar', () => { it('renderiza calendário', () => { render(<MiniCalendar onDateSelect={vi.fn()} />); expect(screen.getByText(/dom/i)).toBeInTheDocument(); }); it('seleciona data', () => { const onDateSelect = vi.fn(); render(<MiniCalendar onDateSelect={onDateSelect} />); fireEvent.click(screen.getByText('15')); expect(onDateSelect).toHaveBeenCalled(); }); });
