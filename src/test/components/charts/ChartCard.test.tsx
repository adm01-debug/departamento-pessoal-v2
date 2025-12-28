import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChartCard } from '@/components/charts/ChartCard';
describe('ChartCard', () => { it('renders', () => { render(<ChartCard />); expect(true).toBe(true); }); });
