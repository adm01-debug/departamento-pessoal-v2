import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Timeline } from '@/components/feedback/Timeline';
const mockEvents = [{ id: '1', title: 'Evento 1', date: '2025-01-01' }];
describe('Timeline', () => { it('renderiza timeline', () => { render(<Timeline events={mockEvents} />); expect(screen.getByText('Evento 1')).toBeInTheDocument(); }); });
