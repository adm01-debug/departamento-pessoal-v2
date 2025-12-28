import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ComparisonChart } from '@/components/data/ComparisonChart';
describe('ComparisonChart', () => { it('renders', () => { render(<ComparisonChart />); }); });
