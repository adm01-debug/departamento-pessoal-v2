import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { FilePicker } from '@/components/forms/FilePicker';
describe('FilePicker', () => { it('renders', () => { render(<FilePicker />); }); });
