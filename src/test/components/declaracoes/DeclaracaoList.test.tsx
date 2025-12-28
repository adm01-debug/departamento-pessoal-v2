import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DeclaracaoList } from '@/components/declaracoes/DeclaracaoList';
describe('DeclaracaoList', () => { it('renders', () => { render(<DeclaracaoList />); expect(true).toBe(true); }); });
