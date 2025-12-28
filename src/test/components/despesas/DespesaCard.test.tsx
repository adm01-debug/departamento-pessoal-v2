import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DespesaCard } from '@/components/despesas/DespesaCard';
describe('DespesaCard', () => { it('renders', () => { render(<DespesaCard />); expect(true).toBe(true); }); });
