import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTimeline } from '@/hooks/useTimeline';
describe('useTimeline', () => { it('retorna timeline', () => { const { result } = renderHook(() => useTimeline('colab-1')); expect(result.current.events).toBeDefined(); }); });
