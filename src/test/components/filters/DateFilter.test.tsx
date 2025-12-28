import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { DateFilter } from '@/components/filters/DateFilter';
describe('DateFilter', () => { it('renders', () => { render(<DateFilter />); }); });
