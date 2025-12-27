import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImportacaoPontoModal } from '@/components/ponto/ImportacaoPontoModal';
describe('ImportacaoPontoModal', () => { it('renderiza modal', () => { render(<ImportacaoPontoModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/importar ponto/i)).toBeInTheDocument(); }); });
