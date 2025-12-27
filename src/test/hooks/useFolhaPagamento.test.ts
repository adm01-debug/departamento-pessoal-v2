import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFolhaPagamento } from '@/hooks/useFolhaPagamento';
describe('useFolhaPagamento', () => { it('processa folha', () => { const { result } = renderHook(() => useFolhaPagamento()); expect(result.current.processarFolha).toBeDefined(); }); });
