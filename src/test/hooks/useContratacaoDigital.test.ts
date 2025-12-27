import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useContratacaoDigital } from '@/hooks/useContratacaoDigital';
describe('useContratacaoDigital', () => { it('gerencia contratação', () => { const { result } = renderHook(() => useContratacaoDigital()); expect(result.current.status).toBeDefined(); }); });
