import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatusPieChart } from '@/components/charts/StatusPieChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, PieChart: ({ children }: any) => <div data-testid="spc">{children}</div>, Pie: () => <div />, Cell: () => <div />, Tooltip: () => <div /> }));
describe('StatusPieChart', () => { it('renderiza gráfico', () => { render(<StatusPieChart data={[{ status: 'Ativo', count: 10 }]} />); expect(screen.getByTestId('spc')).toBeInTheDocument(); }); });
