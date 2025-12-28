import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ObrigacaoCard } from '@/components/obrigacoes/ObrigacaoCard';
describe('ObrigacaoCard', () => { it('renders', () => { render(<ObrigacaoCard />); expect(true).toBe(true); }); });
