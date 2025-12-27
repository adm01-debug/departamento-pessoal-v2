import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';
describe('useDashboardConfig', () => { it('retorna config', () => { const { result } = renderHook(() => useDashboardConfig()); expect(result.current.widgets).toBeDefined(); }); });
