import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TurnoverYearComparisonChart } from '@/components/charts/TurnoverYearComparisonChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, BarChart: ({ children }: any) => <div data-testid="tyc">{children}</div>, Bar: () => <div />, XAxis: () => <div />, YAxis: () => <div />, Tooltip: () => <div />, Legend: () => <div /> }));
describe('TurnoverYearComparisonChart', () => { it('renderiza gráfico', () => { render(<TurnoverYearComparisonChart data={[{ mes: 'Jan', ano2024: 5, ano2025: 4 }]} />); expect(screen.getByTestId('tyc')).toBeInTheDocument(); }); });
