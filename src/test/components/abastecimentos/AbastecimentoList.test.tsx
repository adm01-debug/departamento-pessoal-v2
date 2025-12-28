import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AbastecimentoList } from '@/components/abastecimentos/AbastecimentoList';
describe('AbastecimentoList', () => { it('renders', () => { render(<AbastecimentoList />); expect(true).toBe(true); }); });
