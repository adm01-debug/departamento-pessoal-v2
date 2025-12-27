import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
describe('useCopyToClipboard', () => { it('copia texto', () => { const { result } = renderHook(() => useCopyToClipboard()); expect(result.current[1]).toBeDefined(); }); });
