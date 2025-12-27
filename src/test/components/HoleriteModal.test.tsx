import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HoleriteModal } from '@/components/folha/HoleriteModal';
describe('HoleriteModal', () => { it('renderiza modal', () => { render(<HoleriteModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/holerite/i)).toBeInTheDocument(); }); });
