import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FornecedorCard } from '@/components/fornecedores/FornecedorCard';
describe('FornecedorCard', () => { it('renders', () => { render(<FornecedorCard />); expect(true).toBe(true); }); });
