import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterChip } from '@/components/filters/FilterChip';
describe('FilterChip', () => { it('renderiza chip', () => { render(<FilterChip label="Status" onRemove={vi.fn()} />); expect(screen.getByText('Status')).toBeInTheDocument(); }); it('remove chip', () => { const onRemove = vi.fn(); render(<FilterChip label="Test" onRemove={onRemove} />); fireEvent.click(screen.getByRole('button')); expect(onRemove).toHaveBeenCalled(); }); });
