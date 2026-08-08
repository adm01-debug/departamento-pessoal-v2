import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { mockUseAuth } = vi.hoisted(() => ({ mockUseAuth: vi.fn() }));

vi.mock('@/hooks/useAuth', () => ({ useAuth: mockUseAuth }));

// AdminRoute exige MFA aal2 (fail-closed). Mock do Supabase:
// - session aal2 → acesso liberado
// - erro/falha → bloqueado
const mockMfaGetAAL = vi.hoisted(() => vi.fn());
const mockMfaListFactors = vi.hoisted(() => vi.fn());
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      mfa: {
        getAuthenticatorAssuranceLevel: mockMfaGetAAL,
        listFactors: mockMfaListFactors,
        challengeAndVerify: vi.fn().mockResolvedValue({ error: null }),
      },
    },
  },
}));

import { AdminRoute } from '../AdminRoute';

function renderRoute(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner while not ready', () => {
    mockUseAuth.mockReturnValue({ user: null, isReady: false, loading: true, isAdmin: false });
    renderRoute(<AdminRoute><div>admin content</div></AdminRoute>);
    expect(screen.queryByText('admin content')).toBeNull();
    expect(screen.getByText('Verificando privilégios...')).toBeInTheDocument();
  });

  it('redirects to /login when no user', () => {
    mockUseAuth.mockReturnValue({ user: null, isReady: true, loading: false, isAdmin: false });
    renderRoute(<AdminRoute><div>admin content</div></AdminRoute>);
    expect(screen.queryByText('admin content')).toBeNull();
  });

  it('shows access denied when user is not admin', () => {
    mockUseAuth.mockReturnValue({ user: { id: '1' }, isReady: true, loading: false, isAdmin: false });
    renderRoute(<AdminRoute><div>admin content</div></AdminRoute>);
    expect(screen.queryByText('admin content')).toBeNull();
    expect(screen.getByText('Acesso Restrito')).toBeInTheDocument();
  });

  it('renders children when user is admin and MFA aal2 verified', async () => {
    mockUseAuth.mockReturnValue({ user: { id: '1' }, isReady: true, loading: false, isAdmin: true });
    mockMfaGetAAL.mockResolvedValue({ data: { currentLevel: 'aal2' }, error: null });
    renderRoute(<AdminRoute><div>admin content</div></AdminRoute>);
    expect(await screen.findByText('admin content')).toBeInTheDocument();
  });

  it('blocks admin without MFA (fail-closed)', async () => {
    mockUseAuth.mockReturnValue({ user: { id: '1' }, isReady: true, loading: false, isAdmin: true });
    mockMfaGetAAL.mockResolvedValue({ data: { currentLevel: 'aal1', nextLevel: null }, error: null });
    renderRoute(<AdminRoute><div>admin content</div></AdminRoute>);
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByText('admin content')).toBeNull();
  });
});
