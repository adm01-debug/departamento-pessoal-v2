import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AreaChart } from '@/components/charts/AreaChart';
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="rc">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="ac">{children}</div>,
  Area: () => <div />, XAxis: () => <div />, YAxis: () => <div />, Tooltip: () => <div />
}));
describe('AreaChart', () => {
  it('renderiza gráfico', () => {
    render(<AreaChart data={[{ x: 1, y: 2 }]} />);
    expect(screen.getByTestId('ac')).toBeInTheDocument();
  });
});
