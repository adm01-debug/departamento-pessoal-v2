import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HomologacaoCard } from '@/components/homologacoes/HomologacaoCard';
describe('HomologacaoCard', () => { it('renders', () => { render(<HomologacaoCard />); expect(true).toBe(true); }); });
