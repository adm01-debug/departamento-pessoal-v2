import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DepartmentChart } from '@/components/charts/DepartmentChart';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, PieChart: ({ children }: any) => <div data-testid="pc">{children}</div>, Pie: () => <div />, Cell: () => <div />, Tooltip: () => <div />, Legend: () => <div /> }));
const mockData = [{ nome: 'TI', valor: 10 }];
describe('DepartmentChart', () => { it('renderiza gráfico', () => { render(<DepartmentChart data={mockData} />); expect(screen.getByTestId('pc')).toBeInTheDocument(); }); });
