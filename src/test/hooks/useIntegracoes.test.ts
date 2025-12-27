import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useIntegracoes } from '@/hooks/useIntegracoes';
describe('useIntegracoes', () => { it('gerencia integrações', () => { const { result } = renderHook(() => useIntegracoes()); expect(result.current.integracoes).toBeDefined(); }); });
