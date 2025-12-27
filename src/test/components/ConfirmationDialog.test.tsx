import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
describe('ConfirmationDialog', () => { it('renderiza dialog', () => { render(<ConfirmationDialog open message="Tem certeza?" onConfirm={vi.fn()} onCancel={vi.fn()} />); expect(screen.getByText('Tem certeza?')).toBeInTheDocument(); }); });
