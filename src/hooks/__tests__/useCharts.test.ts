import { renderHook } from '@testing-library/react';
import { useCharts } from '../useCharts';

const mockData = [
  { label: 'Jan', value: 100 },
  { label: 'Fev', value: 200 },
  { label: 'Mar', value: 150 },
];

describe('useCharts', () => {
  it('should format data for bar chart', () => {
    const { result } = renderHook(() => useCharts(mockData));
    expect(result.current.barChartData).toBeDefined();
    expect(result.current.barChartData.labels).toEqual(['Jan', 'Fev', 'Mar']);
  });

  it('should format data for line chart', () => {
    const { result } = renderHook(() => useCharts(mockData));
    expect(result.current.lineChartData).toBeDefined();
  });

  it('should format data for pie chart', () => {
    const { result } = renderHook(() => useCharts(mockData));
    expect(result.current.pieChartData).toBeDefined();
  });

  it('should calculate totals', () => {
    const { result } = renderHook(() => useCharts(mockData));
    expect(result.current.total).toBe(450);
  });

  it('should calculate average', () => {
    const { result } = renderHook(() => useCharts(mockData));
    expect(result.current.average).toBe(150);
  });

  it('should handle empty data', () => {
    const { result } = renderHook(() => useCharts([]));
    expect(result.current.total).toBe(0);
    expect(result.current.average).toBe(0);
  });

  it('should apply custom colors', () => {
    const { result } = renderHook(() => useCharts(mockData, { colors: ['#ff0000', '#00ff00', '#0000ff'] }));
    expect(result.current.barChartData.datasets[0].backgroundColor).toContain('#ff0000');
  });
});
