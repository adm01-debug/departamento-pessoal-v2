import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { CargoList } from '@/components/cargo/CargoList';
describe('CargoList', () => { it('renders', () => { render(<CargoList />); }); });
