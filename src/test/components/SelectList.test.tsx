import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SelectList } from '@/components/form/SelectList';
const mockItems = [{ id: '1', label: 'Item 1' }, { id: '2', label: 'Item 2' }];
describe('SelectList', () => { it('renderiza lista', () => { render(<SelectList items={mockItems} />); expect(screen.getByText('Item 1')).toBeInTheDocument(); }); });
