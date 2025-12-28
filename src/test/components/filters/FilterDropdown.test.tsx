import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { FilterDropdown } from '@/components/filters/FilterDropdown';
describe('FilterDropdown', () => { it('renders', () => { render(<FilterDropdown />); }); });
