import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ServicoList } from '@/components/servicos/ServicoList';
describe('ServicoList', () => { it('renders', () => { render(<ServicoList />); expect(true).toBe(true); }); });
