import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useRescisao } from '@/hooks/useRescisao';
describe('useRescisao', () => { it('calcula rescisão', () => { const { result } = renderHook(() => useRescisao()); expect(result.current.calcular).toBeDefined(); }); });
