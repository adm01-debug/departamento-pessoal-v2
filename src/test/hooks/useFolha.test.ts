import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFolha } from '@/hooks/useFolha';
describe('useFolha', () => { it('gerencia folha', () => { const { result } = renderHook(() => useFolha()); expect(result.current.folhas).toBeDefined(); }); });
