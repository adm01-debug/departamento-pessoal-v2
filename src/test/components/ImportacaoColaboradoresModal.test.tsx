import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImportacaoColaboradoresModal } from '@/components/colaboradores/ImportacaoColaboradoresModal';
describe('ImportacaoColaboradoresModal', () => { it('renderiza modal', () => { render(<ImportacaoColaboradoresModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/importar colaboradores/i)).toBeInTheDocument(); }); });
