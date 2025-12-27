import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputError } from '@/components/form/InputError';
describe('InputError', () => { it('renderiza erro', () => { render(<InputError message="Campo obrigatório" />); expect(screen.getByText('Campo obrigatório')).toBeInTheDocument(); }); it('não renderiza sem mensagem', () => { const { container } = render(<InputError />); expect(container.firstChild).toBeNull(); }); });
