import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RelatorioList } from '@/components/relatorios/RelatorioList';
describe('RelatorioList', () => { it('renders', () => { render(<RelatorioList />); expect(true).toBe(true); }); });
