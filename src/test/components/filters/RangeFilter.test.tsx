import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { RangeFilter } from '@/components/filters/RangeFilter';
describe('RangeFilter', () => { it('renders', () => { render(<RangeFilter />); }); });
