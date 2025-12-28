import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReclamacaoList } from '@/components/reclamacoes/ReclamacaoList';
describe('ReclamacaoList', () => { it('renders', () => { render(<ReclamacaoList />); expect(true).toBe(true); }); });
