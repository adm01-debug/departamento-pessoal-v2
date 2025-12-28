import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormacaoList } from '@/components/formacoes/FormacaoList';
describe('FormacaoList', () => { it('renders', () => { render(<FormacaoList />); expect(true).toBe(true); }); });
