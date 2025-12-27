import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PieChart } from '@/components/charts/PieChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, PieChart: ({ children }: any) => <div data-testid="pie">{children}</div>, Pie: () => <div />, Cell: () => <div />, Tooltip: () => <div />, Legend: () => <div /> }));
describe('PieChart', () => { it('renderiza gráfico', () => { render(<PieChart data={[{ name: 'A', value: 10 }]} />); expect(screen.getByTestId('pie')).toBeInTheDocument(); }); });
