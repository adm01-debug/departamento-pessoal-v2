import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useQueryParams } from '@/hooks/useQueryParams';
describe('useQueryParams', () => { it('gerencia params', () => { const { result } = renderHook(() => useQueryParams()); expect(result.current.get).toBeDefined(); expect(result.current.set).toBeDefined(); }); });
