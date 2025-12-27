import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiComparison } from '@/components/kpi/KpiComparison';
describe('KpiComparison', () => { it('renderiza comparação', () => { render(<KpiComparison current={100} previous={80} label="Vendas" />); expect(screen.getByText('Vendas')).toBeInTheDocument(); expect(screen.getByText('100')).toBeInTheDocument(); }); });
