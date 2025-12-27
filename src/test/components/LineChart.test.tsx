import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LineChart } from '@/components/charts/LineChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, LineChart: ({ children }: any) => <div data-testid="lc">{children}</div>, Line: () => <div />, XAxis: () => <div />, YAxis: () => <div />, Tooltip: () => <div /> }));
describe('LineChart', () => { it('renderiza gráfico', () => { render(<LineChart data={[{ x: 1, y: 2 }]} />); expect(screen.getByTestId('lc')).toBeInTheDocument(); }); });
