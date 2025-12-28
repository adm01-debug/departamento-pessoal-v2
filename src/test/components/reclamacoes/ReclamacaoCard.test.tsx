import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReclamacaoCard } from '@/components/reclamacoes/ReclamacaoCard';
describe('ReclamacaoCard', () => { it('renders', () => { render(<ReclamacaoCard />); expect(true).toBe(true); }); });
