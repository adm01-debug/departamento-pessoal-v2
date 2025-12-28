import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FornecedorList } from '@/components/fornecedores/FornecedorList';
describe('FornecedorList', () => { it('renders', () => { render(<FornecedorList />); expect(true).toBe(true); }); });
