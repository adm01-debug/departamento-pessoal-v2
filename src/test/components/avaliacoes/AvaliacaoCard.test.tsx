import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AvaliacaoCard } from '@/components/avaliacoes/AvaliacaoCard';
describe('AvaliacaoCard', () => { it('renders', () => { render(<AvaliacaoCard />); expect(true).toBe(true); }); });
