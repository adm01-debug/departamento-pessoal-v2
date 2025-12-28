import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { DateRangePicker } from '@/components/forms/DateRangePicker';
describe('DateRangePicker', () => { it('renders', () => { render(<DateRangePicker />); }); });
