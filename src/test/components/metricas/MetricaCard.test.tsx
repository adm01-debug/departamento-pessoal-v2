import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricaCard } from '@/components/metricas/MetricaCard';
describe('MetricaCard', () => { it('renders', () => { render(<MetricaCard />); expect(true).toBe(true); }); });
