import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EstacaoList } from '@/components/estacoes/EstacaoList';
describe('EstacaoList', () => { it('renders', () => { render(<EstacaoList />); expect(true).toBe(true); }); });
