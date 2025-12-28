import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnonimizacaoList } from '@/components/anonimizacoes/AnonimizacaoList';
describe('AnonimizacaoList', () => { it('renders', () => { render(<AnonimizacaoList />); expect(true).toBe(true); }); });
