import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiTrend } from '@/components/kpi/KpiTrend';
describe('KpiTrend', () => { it('renderiza trend positivo', () => { render(<KpiTrend value={10} />); expect(screen.getByText('+10%')).toBeInTheDocument(); }); it('renderiza trend negativo', () => { render(<KpiTrend value={-5} />); expect(screen.getByText('-5%')).toBeInTheDocument(); }); });
