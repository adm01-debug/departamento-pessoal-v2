import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PayrollCostChart } from '@/components/charts/PayrollCostChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, AreaChart: ({ children }: any) => <div data-testid="pcc">{children}</div>, Area: () => <div />, XAxis: () => <div />, YAxis: () => <div />, Tooltip: () => <div /> }));
describe('PayrollCostChart', () => { it('renderiza gráfico', () => { render(<PayrollCostChart data={[{ mes: 'Jan', custo: 100000 }]} />); expect(screen.getByTestId('pcc')).toBeInTheDocument(); }); });
