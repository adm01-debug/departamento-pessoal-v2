import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NovaAdmissaoModal } from '@/components/admissoes/NovaAdmissaoModal';
describe('NovaAdmissaoModal', () => { it('renderiza modal', () => { render(<NovaAdmissaoModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/admissão/i)).toBeInTheDocument(); }); });
