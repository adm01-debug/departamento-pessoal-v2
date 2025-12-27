import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RangeFilter } from '@/components/filters/RangeFilter';
describe('RangeFilter', () => { it('renderiza filtro', () => { render(<RangeFilter min={0} max={100} onChange={vi.fn()} />); expect(screen.getByRole('slider')).toBeInTheDocument(); }); });
