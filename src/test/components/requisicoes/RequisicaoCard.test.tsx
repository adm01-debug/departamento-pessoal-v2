import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RequisicaoCard } from '@/components/requisicoes/RequisicaoCard';
describe('RequisicaoCard', () => { it('renders', () => { render(<RequisicaoCard />); expect(true).toBe(true); }); });
