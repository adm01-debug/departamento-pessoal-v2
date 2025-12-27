import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '@/components/badges/StatusBadge';
describe('StatusBadge', () => { it('renderiza status ativo', () => { render(<StatusBadge status="ativo" />); expect(screen.getByText('Ativo')).toBeInTheDocument(); }); it('renderiza status inativo', () => { render(<StatusBadge status="inativo" />); expect(screen.getByText('Inativo')).toBeInTheDocument(); }); });
