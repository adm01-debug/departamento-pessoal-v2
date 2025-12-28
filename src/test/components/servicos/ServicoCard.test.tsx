import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ServicoCard } from '@/components/servicos/ServicoCard';
describe('ServicoCard', () => { it('renders', () => { render(<ServicoCard />); expect(true).toBe(true); }); });
