import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImportValidation } from '@/components/import/ImportValidation';
const mockErrors = [{ row: 1, message: 'CPF inválido' }];
describe('ImportValidation', () => { it('renderiza validação', () => { render(<ImportValidation errors={mockErrors} />); expect(screen.getByText('CPF inválido')).toBeInTheDocument(); }); it('exibe sucesso', () => { render(<ImportValidation errors={[]} />); expect(screen.getByText(/sucesso/i)).toBeInTheDocument(); }); });
