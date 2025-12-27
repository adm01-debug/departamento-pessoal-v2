import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventoESocialModal } from '@/components/esocial/EventoESocialModal';
describe('EventoESocialModal', () => { it('renderiza modal', () => { render(<EventoESocialModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/evento/i)).toBeInTheDocument(); }); });
