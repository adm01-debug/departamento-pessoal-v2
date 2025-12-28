import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdiantamentoList } from '@/components/adiantamentos/AdiantamentoList';
describe('AdiantamentoList', () => { it('renders', () => { render(<AdiantamentoList />); expect(true).toBe(true); }); });
