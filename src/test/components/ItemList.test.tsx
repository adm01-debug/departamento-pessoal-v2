import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ItemList } from '@/components/lists/ItemList';
const mockItems = [{ id: '1', label: 'Item 1' }, { id: '2', label: 'Item 2' }];
describe('ItemList', () => { it('renderiza lista', () => { render(<ItemList items={mockItems} />); expect(screen.getByText('Item 1')).toBeInTheDocument(); }); });
