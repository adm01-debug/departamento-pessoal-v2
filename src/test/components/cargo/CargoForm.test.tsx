import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { CargoForm } from '@/components/cargo/CargoForm';
describe('CargoForm', () => { it('renders', () => { render(<CargoForm />); }); });
