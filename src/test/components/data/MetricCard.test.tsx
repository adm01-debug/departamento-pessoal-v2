import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { MetricCard } from '@/components/data/MetricCard';
describe('MetricCard', () => { it('renders', () => { render(<MetricCard />); }); });
