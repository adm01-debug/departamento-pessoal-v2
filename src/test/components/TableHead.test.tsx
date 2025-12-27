import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableHead } from '@/components/tables/TableHead';
const mockColumns = [{ key: 'nome', label: 'Nome' }, { key: 'cargo', label: 'Cargo' }];
describe('TableHead', () => { it('renderiza cabeçalho', () => { render(<table><TableHead columns={mockColumns} /></table>); expect(screen.getByText('Nome')).toBeInTheDocument(); expect(screen.getByText('Cargo')).toBeInTheDocument(); }); });
