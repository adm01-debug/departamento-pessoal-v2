import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMutationWithToast } from '@/hooks/useMutationWithToast';
describe('useMutationWithToast', () => { it('executa mutation', () => { const { result } = renderHook(() => useMutationWithToast(async () => {})); expect(result.current.mutate).toBeDefined(); }); });
