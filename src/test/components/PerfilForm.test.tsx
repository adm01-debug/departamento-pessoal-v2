import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PerfilForm } from '@/components/perfil/PerfilForm';
describe('PerfilForm', () => { it('renderiza formulário', () => { render(<PerfilForm onSubmit={vi.fn()} />); expect(screen.getByLabelText(/nome/i)).toBeInTheDocument(); }); });
