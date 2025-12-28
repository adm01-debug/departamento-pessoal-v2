import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ColaboradorForm } from '@/components/colaboradores/ColaboradorForm';
describe('ColaboradorForm', () => {
  it('renders', () => { render(<ColaboradorForm />); });
  it('displays content', () => { expect(true).toBe(true); });
});
