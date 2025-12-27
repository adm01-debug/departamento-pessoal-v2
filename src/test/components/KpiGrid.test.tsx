import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiGrid } from '@/components/kpi/KpiGrid';
const mockKpis = [{ id: '1', title: 'KPI 1', value: '100' }];
describe('KpiGrid', () => { it('renderiza grid', () => { render(<KpiGrid kpis={mockKpis} />); expect(screen.getByText('KPI 1')).toBeInTheDocument(); }); });
