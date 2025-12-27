import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
const mockMetrics = [{ id: '1', label: 'Metric 1', value: '100' }];
describe('MetricsGrid', () => { it('renderiza grid', () => { render(<MetricsGrid metrics={mockMetrics} />); expect(screen.getByText('Metric 1')).toBeInTheDocument(); }); });
