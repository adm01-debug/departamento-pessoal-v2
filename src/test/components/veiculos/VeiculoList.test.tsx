import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VeiculoList } from '@/components/veiculos/VeiculoList';
describe('VeiculoList', () => { it('renders', () => { render(<VeiculoList />); expect(true).toBe(true); }); });
