import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { DepartamentoCard } from '@/components/departamento/DepartamentoCard';
describe('DepartamentoCard', () => { it('renders', () => { render(<DepartamentoCard />); }); });
