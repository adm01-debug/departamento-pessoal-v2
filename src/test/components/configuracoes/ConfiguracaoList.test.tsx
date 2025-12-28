import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfiguracaoList } from '@/components/configuracoes/ConfiguracaoList';
describe('ConfiguracaoList', () => { it('renders', () => { render(<ConfiguracaoList />); expect(true).toBe(true); }); });
