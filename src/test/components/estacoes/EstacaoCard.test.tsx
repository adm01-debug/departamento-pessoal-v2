import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EstacaoCard } from '@/components/estacoes/EstacaoCard';
describe('EstacaoCard', () => { it('renders', () => { render(<EstacaoCard />); expect(true).toBe(true); }); });
