import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
describe('ErrorMessage', () => { it('renderiza mensagem', () => { render(<ErrorMessage>Erro ocorreu</ErrorMessage>); expect(screen.getByText('Erro ocorreu')).toBeInTheDocument(); }); });
