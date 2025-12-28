import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfiguracaoCard } from '@/components/configuracoes/ConfiguracaoCard';
describe('ConfiguracaoCard', () => { it('renders', () => { render(<ConfiguracaoCard />); expect(true).toBe(true); }); });
