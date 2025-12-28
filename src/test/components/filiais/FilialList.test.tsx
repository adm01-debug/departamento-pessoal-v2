import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilialList } from '@/components/filiais/FilialList';
describe('FilialList', () => {
  it('renders', () => { render(<FilialList />); expect(true).toBe(true); });
});
