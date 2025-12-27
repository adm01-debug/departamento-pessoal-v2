import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TurnoverEvolutionChart } from '@/components/charts/TurnoverEvolutionChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, LineChart: ({ children }: any) => <div data-testid="tec">{children}</div>, Line: () => <div />, XAxis: () => <div />, YAxis: () => <div />, Tooltip: () => <div /> }));
describe('TurnoverEvolutionChart', () => { it('renderiza gráfico', () => { render(<TurnoverEvolutionChart data={[{ mes: 'Jan', taxa: 5 }]} />); expect(screen.getByTestId('tec')).toBeInTheDocument(); }); });
