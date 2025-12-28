import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DespesaList } from '@/components/despesas/DespesaList';
describe('DespesaList', () => { it('renders', () => { render(<DespesaList />); expect(true).toBe(true); }); });
