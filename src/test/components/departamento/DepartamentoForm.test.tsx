import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { DepartamentoForm } from '@/components/departamento/DepartamentoForm';
describe('DepartamentoForm', () => { it('renders', () => { render(<DepartamentoForm />); }); });
