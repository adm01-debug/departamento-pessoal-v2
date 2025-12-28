import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { BankAccountForm } from '@/components/forms/BankAccountForm';
describe('BankAccountForm', () => { it('renders', () => { render(<BankAccountForm />); }); });
