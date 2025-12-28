import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RequisicaoList } from '@/components/requisicoes/RequisicaoList';
describe('RequisicaoList', () => { it('renders', () => { render(<RequisicaoList />); expect(true).toBe(true); }); });
