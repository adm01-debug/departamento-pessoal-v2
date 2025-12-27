import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoteESocialModal } from '@/components/esocial/LoteESocialModal';
describe('LoteESocialModal', () => { it('renderiza modal', () => { render(<LoteESocialModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/lote/i)).toBeInTheDocument(); }); });
