import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColaboradorModal } from '@/components/colaboradores/ColaboradorModal';
describe('ColaboradorModal', () => { it('renderiza modal', () => { render(<ColaboradorModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/colaborador/i)).toBeInTheDocument(); }); });
