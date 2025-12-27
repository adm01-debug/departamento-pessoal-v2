import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFeriasAprovacao } from '@/hooks/useFeriasAprovacao';
describe('useFeriasAprovacao', () => { it('gerencia aprovação', () => { const { result } = renderHook(() => useFeriasAprovacao()); expect(result.current.approve).toBeDefined(); expect(result.current.reject).toBeDefined(); }); });
