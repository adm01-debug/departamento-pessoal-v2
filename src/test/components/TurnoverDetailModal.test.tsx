import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TurnoverDetailModal } from '@/components/turnover/TurnoverDetailModal';
describe('TurnoverDetailModal', () => { it('renderiza modal', () => { render(<TurnoverDetailModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/turnover/i)).toBeInTheDocument(); }); });
