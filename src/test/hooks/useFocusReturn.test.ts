import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFocusReturn } from '@/hooks/useFocusReturn';
describe('useFocusReturn', () => { it('retorna foco', () => { const ref = { current: document.createElement('button') }; renderHook(() => useFocusReturn(ref)); }); });
