import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataGrid } from '@/components/data/DataGrid';
const mockData = [{ id: '1', nome: 'Item 1' }, { id: '2', nome: 'Item 2' }];
const mockColumns = [{ key: 'nome', header: 'Nome' }];
describe('DataGrid', () => { it('renderiza grid', () => { render(<DataGrid data={mockData} columns={mockColumns} />); expect(screen.getByText('Item 1')).toBeInTheDocument(); }); });
