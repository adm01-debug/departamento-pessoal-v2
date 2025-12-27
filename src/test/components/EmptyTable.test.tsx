import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyTable } from '@/components/tables/EmptyTable';
describe('EmptyTable', () => { it('renderiza mensagem', () => { render(<EmptyTable message="Nenhum dado" />); expect(screen.getByText('Nenhum dado')).toBeInTheDocument(); }); it('exibe ícone', () => { const { container } = render(<EmptyTable />); expect(container.querySelector('svg')).toBeInTheDocument(); }); });
