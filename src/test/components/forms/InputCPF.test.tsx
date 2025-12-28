import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { InputCPF } from '@/components/forms/InputCPF';
describe('InputCPF', () => { it('renders', () => { render(<InputCPF />); }); });
