import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContratoList } from '@/components/contratos/ContratoList';
describe('ContratoList', () => {
  it('renders', () => { render(<ContratoList />); expect(true).toBe(true); });
});
