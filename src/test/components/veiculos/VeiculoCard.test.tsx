import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VeiculoCard } from '@/components/veiculos/VeiculoCard';
describe('VeiculoCard', () => { it('renders', () => { render(<VeiculoCard />); expect(true).toBe(true); }); });
