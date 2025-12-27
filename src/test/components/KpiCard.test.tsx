import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from '@/components/kpi/KpiCard';
describe('KpiCard', () => { it('renderiza KPI', () => { render(<KpiCard title="Total" value="1000" />); expect(screen.getByText('Total')).toBeInTheDocument(); expect(screen.getByText('1000')).toBeInTheDocument(); }); it('exibe trend', () => { render(<KpiCard title="T" value="100" trend={10} />); expect(screen.getByText(/10%/)).toBeInTheDocument(); }); });
