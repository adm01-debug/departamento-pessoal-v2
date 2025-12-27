import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DonutChart } from '@/components/charts/DonutChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, PieChart: ({ children }: any) => <div data-testid="dc">{children}</div>, Pie: () => <div />, Cell: () => <div /> }));
describe('DonutChart', () => { it('renderiza gráfico', () => { render(<DonutChart data={[{ name: 'A', value: 10 }]} />); expect(screen.getByTestId('dc')).toBeInTheDocument(); }); });
