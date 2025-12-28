import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { InputCEP } from '@/components/forms/InputCEP';
describe('InputCEP', () => { it('renders', () => { render(<InputCEP />); }); });
