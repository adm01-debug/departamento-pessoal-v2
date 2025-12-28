import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdiantamentoCard } from '@/components/adiantamentos/AdiantamentoCard';
describe('AdiantamentoCard', () => { it('renders', () => { render(<AdiantamentoCard />); expect(true).toBe(true); }); });
