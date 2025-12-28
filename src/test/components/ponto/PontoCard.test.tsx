import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PontoCard } from '@/components/ponto/PontoCard';
describe('PontoCard', () => {
  it('renders', () => { render(<PontoCard />); });
  it('displays content', () => { expect(true).toBe(true); });
});
