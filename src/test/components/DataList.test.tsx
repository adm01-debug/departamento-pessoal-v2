import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataList } from '@/components/data/DataList';
const mockItems = [{ id: '1', label: 'A' }, { id: '2', label: 'B' }];
describe('DataList', () => { it('renderiza lista', () => { render(<DataList items={mockItems} />); expect(screen.getByText('A')).toBeInTheDocument(); }); });
