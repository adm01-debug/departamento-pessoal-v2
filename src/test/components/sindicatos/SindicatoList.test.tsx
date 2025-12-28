import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SindicatoList } from '@/components/sindicatos/SindicatoList';
describe('SindicatoList', () => {
  it('renders', () => { render(<SindicatoList />); expect(true).toBe(true); });
});
