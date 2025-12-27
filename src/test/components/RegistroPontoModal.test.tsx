import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RegistroPontoModal } from '@/components/ponto/RegistroPontoModal';
describe('RegistroPontoModal', () => { it('renderiza modal', () => { render(<RegistroPontoModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/ponto/i)).toBeInTheDocument(); }); });
