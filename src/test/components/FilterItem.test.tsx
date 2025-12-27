import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterItem } from '@/components/filters/FilterItem';
describe('FilterItem', () => { it('renderiza item', () => { render(<FilterItem label="Item" value="1" onChange={vi.fn()} />); expect(screen.getByText('Item')).toBeInTheDocument(); }); });
