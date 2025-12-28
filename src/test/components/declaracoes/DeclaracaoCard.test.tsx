import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DeclaracaoCard } from '@/components/declaracoes/DeclaracaoCard';
describe('DeclaracaoCard', () => { it('renders', () => { render(<DeclaracaoCard />); expect(true).toBe(true); }); });
