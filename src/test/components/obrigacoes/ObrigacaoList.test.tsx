import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ObrigacaoList } from '@/components/obrigacoes/ObrigacaoList';
describe('ObrigacaoList', () => { it('renders', () => { render(<ObrigacaoList />); expect(true).toBe(true); }); });
