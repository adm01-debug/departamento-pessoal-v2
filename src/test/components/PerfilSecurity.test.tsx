import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PerfilSecurity } from '@/components/perfil/PerfilSecurity';
describe('PerfilSecurity', () => { it('renderiza segurança', () => { render(<PerfilSecurity onChangePassword={vi.fn()} />); expect(screen.getByText(/senha/i)).toBeInTheDocument(); }); });
