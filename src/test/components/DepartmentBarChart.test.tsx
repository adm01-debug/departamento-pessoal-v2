import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DepartmentBarChart } from '@/components/charts/DepartmentBarChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, BarChart: ({ children }: any) => <div data-testid="bc">{children}</div>, Bar: () => <div />, XAxis: () => <div />, YAxis: () => <div />, Tooltip: () => <div /> }));
const mockData = [{ departamento: 'TI', colaboradores: 10 }];
describe('DepartmentBarChart', () => { it('renderiza gráfico', () => { render(<DepartmentBarChart data={mockData} />); expect(screen.getByTestId('bc')).toBeInTheDocument(); }); });
