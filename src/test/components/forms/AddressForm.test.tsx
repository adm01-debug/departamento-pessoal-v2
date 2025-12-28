import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { AddressForm } from '@/components/forms/AddressForm';
describe('AddressForm', () => { it('renders', () => { render(<AddressForm />); }); });
