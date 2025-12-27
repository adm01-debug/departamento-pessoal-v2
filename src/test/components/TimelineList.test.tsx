import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimelineList } from '@/components/feedback/TimelineList';
const mockItems = [{ id: '1', content: 'Item 1', date: '2025-01-01' }];
describe('TimelineList', () => { it('renderiza lista', () => { render(<TimelineList items={mockItems} />); expect(screen.getByText('Item 1')).toBeInTheDocument(); }); });
