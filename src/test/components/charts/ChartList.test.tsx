import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChartList } from '@/components/charts/ChartList';
describe('ChartList', () => { it('renders', () => { render(<ChartList />); expect(true).toBe(true); }); });
