import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GaugeChart } from '@/components/charts/GaugeChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, PieChart: ({ children }: any) => <div data-testid="gc">{children}</div>, Pie: () => <div />, Cell: () => <div /> }));
describe('GaugeChart', () => { it('renderiza gauge', () => { render(<GaugeChart value={75} max={100} />); expect(screen.getByTestId('gc')).toBeInTheDocument(); }); });
