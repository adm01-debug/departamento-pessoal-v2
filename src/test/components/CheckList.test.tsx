import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CheckList } from '@/components/lists/CheckList';
const mockItems = [{ id: '1', label: 'Item 1', checked: true }, { id: '2', label: 'Item 2', checked: false }];
describe('CheckList', () => { it('renderiza lista', () => { render(<CheckList items={mockItems} />); expect(screen.getByText('Item 1')).toBeInTheDocument(); }); });
