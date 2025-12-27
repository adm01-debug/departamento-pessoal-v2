import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BarChart } from '@/components/charts/BarChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div data-testid="rc">{children}</div>, BarChart: ({ children }: any) => <div data-testid="bc">{children}</div>, Bar: () => <div />, XAxis: () => <div />, YAxis: () => <div />, Tooltip: () => <div /> }));
describe('BarChart', () => { it('renderiza gráfico', () => { render(<BarChart data={[{ x: 1, y: 2 }]} />); expect(screen.getByTestId('bc')).toBeInTheDocument(); }); });
