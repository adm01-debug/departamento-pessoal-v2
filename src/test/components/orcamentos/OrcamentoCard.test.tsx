import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrcamentoCard } from '@/components/orcamentos/OrcamentoCard';
describe('OrcamentoCard', () => { it('renders', () => { render(<OrcamentoCard />); expect(true).toBe(true); }); });
