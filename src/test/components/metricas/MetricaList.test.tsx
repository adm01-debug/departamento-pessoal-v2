import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricaList } from '@/components/metricas/MetricaList';
describe('MetricaList', () => { it('renders', () => { render(<MetricaList />); expect(true).toBe(true); }); });
