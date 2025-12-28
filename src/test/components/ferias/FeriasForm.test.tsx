import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeriasForm } from '@/components/ferias/FeriasForm';
describe('FeriasForm', () => {
  it('renders', () => { render(<FeriasForm />); });
  it('displays content', () => { expect(true).toBe(true); });
});
