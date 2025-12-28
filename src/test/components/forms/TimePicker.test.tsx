import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { TimePicker } from '@/components/forms/TimePicker';
describe('TimePicker', () => { it('renders', () => { render(<TimePicker />); }); });
