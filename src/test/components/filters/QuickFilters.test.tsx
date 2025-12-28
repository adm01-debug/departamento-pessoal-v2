import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { QuickFilters } from '@/components/filters/QuickFilters';
describe('QuickFilters', () => { it('renders', () => { render(<QuickFilters />); }); });
