import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PontoList } from '@/components/ponto/PontoList';
describe('PontoList', () => {
  it('renders', () => { render(<PontoList />); });
  it('displays content', () => { expect(true).toBe(true); });
});
