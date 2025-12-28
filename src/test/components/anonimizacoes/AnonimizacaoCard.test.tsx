import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnonimizacaoCard } from '@/components/anonimizacoes/AnonimizacaoCard';
describe('AnonimizacaoCard', () => { it('renders', () => { render(<AnonimizacaoCard />); expect(true).toBe(true); }); });
