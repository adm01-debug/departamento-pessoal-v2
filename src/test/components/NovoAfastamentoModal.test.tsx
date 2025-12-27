import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NovoAfastamentoModal } from '@/components/afastamentos/NovoAfastamentoModal';
describe('NovoAfastamentoModal', () => { it('renderiza modal', () => { render(<NovoAfastamentoModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/afastamento/i)).toBeInTheDocument(); }); });
