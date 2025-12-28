import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { FilterPanel } from '@/components/filters/FilterPanel';
describe('FilterPanel', () => { it('renders', () => { render(<FilterPanel />); }); });
