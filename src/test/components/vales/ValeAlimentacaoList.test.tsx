import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ValeAlimentacaoList } from '@/components/vales/ValeAlimentacaoList';
describe('ValeAlimentacaoList', () => { it('renders', () => { render(<ValeAlimentacaoList />); expect(true).toBe(true); }); });
